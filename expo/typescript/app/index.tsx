import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, View, Clipboard,  SafeAreaView, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert, Linking, AppState, AppStateStatus, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppKit } from '@reown/appkit-wagmi-react-native';
import { AppKit } from '@reown/appkit-wagmi-react-native';
import { useAccount, useWalletClient, useSwitchChain, useDisconnect } from 'wagmi';
import { ethers } from 'krnl-sdk';
import { executeKrnl, callContractProtectedFunction } from '@/components/kernels/onchain/337';
import { CONTRACT_ADDRESS, KERNEL_ID, abi } from '@/components/kernels/onchain/337/config';
import { styles } from './styles';
import Header from '@/components/Header';
import TransactionEventTracker from '@/components/TransactionEventTracker';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { IconSymbol } from '@/components/ui/IconSymbol.ios';

const hexAdapter = (decimal: number) => {
  return ethers.toBeHex(decimal);
}

// Define network types
const NETWORKS = {
  sepolia: {
    name: 'Sepolia',
    chainId: hexAdapter(11155111), // Chain ID for Sepolia (11155111 in decimal)
    icon: require('../assets/images/sepolia.svg'),
  },
  optimism: {
    name: 'Optimism Sepolia',
    chainId: hexAdapter(11155420), // Chain ID for Optimism Sepolia (11155420 in decimal)
    icon: require('../assets/images/optimism.svg'),
  },
  base: {
    name: 'Base Sepolia',
    chainId: hexAdapter(84532), // Chain ID for Base (84532 in decimal)
    icon: require('../assets/images/base.svg'),
  },
};

// Event data interface
interface EventData {
  sender: string;
  data: number;
  message: string;
  blockNumber: number;
}

// KRNL Response interface
interface KrnlResponse {
  [key: string]: any;
}

export default function HomePage() {
  // Use a ref to track if component is mounted
  const isMountedRef = useRef(true);
  // Track app state to handle background/foreground transitions
  const appStateRef = useRef(AppState.currentState);
  const [appState, setAppState] = useState(AppState.currentState);
  const isReturningFromWallet = useRef(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedNetwork, setSelectedNetwork] = useState('sepolia');
  const [networkModalVisible, setNetworkModalVisible] = useState(false);
  const [networkSwitchPending, setNetworkSwitchPending] = useState(false);

  // Use Appkit hooks for wallet connection
  const { open, close } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChain, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();
  const { disconnect } = useDisconnect();

  // KRNL state variables
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState<KrnlResponse | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [step, setStep] = useState('');

  // Refs for provider, signer, and contract to avoid rendering issues
  const providerRef = useRef<ethers.Provider | null>(null);
  const signerRef = useRef<ethers.Signer | null>(null);
  const contractRef = useRef<ethers.Contract | null>(null);

  // State variables for UI only
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [krnlModalVisible, setKrnlModalVisible] = useState(false);

  const queryClient = useQueryClient();

  // Track component unmounting
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle app state changes
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    // When app goes to background (likely switching to MetaMask)
    if (appStateRef.current.match(/active/) && nextAppState.match(/inactive|background/)) {
      console.log('App went to background, possibly for wallet signing');
      if (loading) {
        isReturningFromWallet.current = true;
      }
    }

    // When app comes back to foreground
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App came back to foreground');

      // If we were in the middle of a transaction, give the app time to stabilize
      if (isReturningFromWallet.current) {
        console.log('Returning from wallet, stabilizing app state');

        // Use a longer timeout to ensure the app is fully restored before continuing
        setTimeout(() => {
          if (isMountedRef.current) {
            isReturningFromWallet.current = false;

            // Check if we need to update UI based on transaction status
            if (transactionHash && !transactionLoading) {
              console.log('Transaction was completed while in background');
              // Transaction completed while in background
              requestAnimationFrame(() => {
                if (isMountedRef.current) {
                  setStep('Transaction confirmed');
                  setLoading(false);
                  setKrnlModalVisible(false);
                }
              });
            }
          }
        }, 1000);
      }
    }

    // Update the app state ref and state
    appStateRef.current = nextAppState;
    setAppState(nextAppState);
  }, [loading, transactionHash, transactionLoading]);

  // Safe state setter function to prevent updates on unmounted component
  const safeSetState = useCallback((setter: Function, value: any) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  // Effect to update selected network based on chainId
  useEffect(() => {
    if (chainId) {
      const chainIdHex = `0x${chainId.toString(16)}`;

      // Find the network that matches the current chainId
      let found = false;
      for (const [networkName, network] of Object.entries(NETWORKS)) {
        if (network.chainId === chainIdHex) {
          found = true;
          // Use safe state setter
          safeSetState(setSelectedNetwork, networkName);
          break;
        }
      }

      // If not found, default to sepolia
      if (!found && isMountedRef.current) {
        setSelectedNetwork('sepolia');
      }
    }
  }, [chainId, safeSetState]);

  // Update signer and provider when wallet client changes
  useEffect(() => {
    let isActive = true;

    const setupWallet = async () => {
      if (walletClient && isConnected) {
        try {
          // Create a provider from the wallet client
          const provider = new ethers.BrowserProvider(walletClient);

          // Get the signer from the provider
          const signer = await provider.getSigner();

          if (isActive && isMountedRef.current) {
            // Store in refs to avoid render cycle issues
            providerRef.current = provider;
            signerRef.current = signer;
            console.log("Signer set successfully");

            // Setup contract with the new signer if we have an address
            if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
              try {
                const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
                contractRef.current = contractInstance;
                console.log("Contract set successfully");
              } catch (err) {
                console.error("Error creating contract:", err);
                contractRef.current = null;
              }
            }
          }
        } catch (err) {
          console.error("Error setting signer:", err);
          if (isActive && isMountedRef.current) {
            providerRef.current = null;
            signerRef.current = null;
            contractRef.current = null;
          }
        }
      } else {
        if (isActive && isMountedRef.current) {
          providerRef.current = null;
          signerRef.current = null;
          contractRef.current = null;
        }
      }
    };

    // Use a timeout to defer the wallet setup
    const timeoutId = setTimeout(() => {
      setupWallet();
    }, 200);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [walletClient, isConnected, CONTRACT_ADDRESS]);

  // Effect to handle switch chain errors
  useEffect(() => {
    if (switchChainError && isMountedRef.current) {
      setError(`Failed to switch network: ${switchChainError.message}`);
      setNetworkSwitchPending(false);
    }
  }, [switchChainError]);

  // Connect wallet function
  const connectWallet = useCallback(() => {
    open({ view: 'Connect' });
  }, [open]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    // Use Wagmi's disconnect function directly
    disconnect();
    
    // Also reset local state
    if (isMountedRef.current) {
      setResponse(null);
      setEventData(null);
      setTransactionHash('');
      setError('');
      providerRef.current = null;
      signerRef.current = null;
      contractRef.current = null;
      setLoading(false);
      
      console.log("Wallet disconnected, state reset");
    }
  }, [disconnect]);

  // Switch network function - wrapped in useCallback to prevent recreation
  const handleNetworkSwitch = useCallback((networkName: string) => {
    if (!isMountedRef.current) return;

    try {
      setNetworkSwitchPending(true);
      const network = NETWORKS[networkName as keyof typeof NETWORKS];

      if (!network) {
        throw new Error(`Network configuration not found for ${networkName}`);
      }

      // Parse the chainId from hex to number
      const chainIdNum = parseInt(network.chainId.slice(2), 16);

      if (isConnected) {
        // Use wagmi's switchChain hook to switch networks
        switchChain({ chainId: chainIdNum });
      }

      if (isMountedRef.current) {
        setSelectedNetwork(networkName);
        setNetworkModalVisible(false);
      }
    } catch (err: any) {
      console.error("Error switching network:", err);
      if (isMountedRef.current) {
        setError(`Failed to switch network: ${err.message}`);
      }
    } finally {
      if (isMountedRef.current) {
        setNetworkSwitchPending(false);
      }
    }
  }, [isConnected, switchChain]);

  // Execute KRNL with wallet connection - wrapped in useCallback
  const executeKrnlWithWallet = useCallback(async () => {
    if (loading || !isMountedRef.current) return; // Prevent multiple simultaneous executions

    // Reset wallet return flag
    isReturningFromWallet.current = false;

    // Use requestAnimationFrame to ensure we're not in the middle of a render cycle
    requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      setLoading(true);
      setResponseLoading(true);
      setTransactionLoading(false);
      setError('');
      setTransactionHash('');
      setResponse(null);
      setEventData(null);
      setStep('Preparing KRNL request...');
      setKrnlModalVisible(true);
    });

    try {
      // Wait for state updates to complete before proceeding
      await new Promise(resolve => setTimeout(resolve, 100));

      // Double-check connection status before proceeding
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      // Get the current signer from ref and verify it's still valid
      const signer = signerRef.current;
      if (!signer) {
        throw new Error("Signer not available. Please reconnect your wallet.");
      }

      // Execute KRNL kernels using the imported function
      if (isMountedRef.current) {
        // Use requestAnimationFrame for state updates
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setStep('Calling KRNL node...');
          }
        });
      }

      // Wait for state update
      await new Promise(resolve => setTimeout(resolve, 50));

      // Pass the connected address and kernel ID to the executeKrnl function
      const krnlPayload = await executeKrnl(address, KERNEL_ID);
      console.log('KRNL Payload:', krnlPayload);

      if (isMountedRef.current) {
        // Use requestAnimationFrame for state updates
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setResponse(krnlPayload);
            setResponseLoading(false);
            setStep('KRNL response received');
          }
        });
      }

      // Wait for state update
      await new Promise(resolve => setTimeout(resolve, 50));

      // Call smart contract with KRNL results
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        if (isMountedRef.current) {
          // Use requestAnimationFrame for state updates
          requestAnimationFrame(() => {
            if (isMountedRef.current) {
              setTransactionLoading(true);
              setStep('Preparing transaction...');
              setStep('Sending transaction to contract...');
            }
          });
        }

        // Wait for state update
        await new Promise(resolve => setTimeout(resolve, 50));

        // Pass the signer to the callContractProtectedFunction
        const txHash = await callContractProtectedFunction(krnlPayload, signer);

        if (isMountedRef.current) {
          // Use requestAnimationFrame for state updates
          requestAnimationFrame(() => {
            if (isMountedRef.current) {
              setTransactionHash(txHash);
              setTransactionLoading(false);
              setStep('Transaction confirmed');
            }
          });
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      if (isMountedRef.current) {
        // Use requestAnimationFrame for state updates
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setError(err.message || 'An error occurred');
            setResponseLoading(false);
            setTransactionLoading(false);
          }
        });
        Alert.alert('Error', err.message || 'An error occurred');
      }
    } finally {
      // Wait for any pending state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      if (isMountedRef.current) {
        // Use requestAnimationFrame for state updates
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setLoading(false);
            setKrnlModalVisible(false);
          }
        });
      }
    }
  }, [address, isConnected, loading]);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar style="light" />

      {/* Use our simplified header component */}
      <Header
        selectedNetwork={selectedNetwork}
        setNetworkModalVisible={setNetworkModalVisible}
        isConnected={isConnected}
        address={address}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        handleNetworkSwitch={handleNetworkSwitch}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, isDark && styles.darkText]}>
            Build with <Text style={styles.heroTitleBlue}>KRNL</Text>
          </Text>
          <Text style={[styles.heroSubtitle, isDark && styles.darkText]}>
            Interact with your registered smart contract using this Expo template.
            Connect your wallet, select a network, and execute the transaction using kOS.
          </Text>
        </View>

        {/* KRNL Execution Card */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={[styles.cardHeader, isDark && styles.darkCardHeader]}>
            <Text style={[styles.cardTitle, isDark && styles.darkText]}>KRNL Execution</Text>
          </View>

          <View style={styles.cardContent}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {isConnected ? (
              <View>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, isDark && styles.darkText]}>Kernel ID</Text>
                    <View style={[styles.infoValue, isDark && styles.darkInfoValue]}>
                      <Text style={[styles.infoValueText, isDark && styles.darkInfoValueText]}>
                        {KERNEL_ID || 'Not configured'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, isDark && styles.darkText]}>Contract Address</Text>
                    <View style={[styles.infoValue, isDark && styles.darkInfoValue]}>
                      <Text style={[styles.infoValueText, isDark && styles.darkInfoValueText]}>
                        {CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
                          ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`
                          : 'Not configured'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.executeButton, loading && styles.disabledButton]}
                    onPress={executeKrnlWithWallet}
                    disabled={loading}
                  >
                    {loading ? (
                      <View style={styles.buttonContent}>
                        <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonLoader} />
                        <Text style={styles.executeButtonText}>Processing...</Text>
                      </View>
                    ) : (
                      <Text style={styles.executeButtonText}>Execute KRNL</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.notConnectedContainer}>
                <Text style={[styles.notConnectedTitle, isDark && styles.darkText]}>Wallet Not Connected</Text>
                <Text style={[styles.notConnectedSubtitle, isDark && styles.darkSubText]}>
                  Please connect your wallet to interact with kOS
                </Text>
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={connectWallet}
                >
                  <Text style={styles.connectButtonText}>Connect Wallet</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* KRNL Response Card - only show if there's a response */}
        {response && Object.keys(response).length > 0 && (
          <View style={[styles.card, isDark && styles.darkCard]}>
            <View style={[styles.cardHeader, isDark && styles.darkCardHeader]}>
              <Text style={[styles.cardTitle, isDark && styles.darkText]}>Kernel Responses</Text>
            </View>

            <View style={styles.cardContent}>
              {responseLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text style={[styles.loadingText, isDark && styles.darkText]}>
                    Fetching kernel responses...
                  </Text>
                </View>
              ) : (
                <View style={styles.responseContainer}>
                  <Text style={[styles.responseLabel, isDark && styles.darkText]}>Response Data:</Text>
                  <View style={[styles.responseData, isDark && styles.darkResponseData]}>
                    <ScrollView
                      style={[{ maxHeight: showFullResponse ? 300 : 150 }]}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      <Text style={[styles.responseText, isDark && styles.darkResponseText]}>
                        {JSON.stringify(response, null, 2)}
                      </Text>
                    </ScrollView>
                    <TouchableOpacity
                      style={styles.toggleResponseButton}
                      onPress={() => setShowFullResponse(!showFullResponse)}
                    >
                      <Text style={styles.toggleResponseText}>
                        {showFullResponse ? 'Show less' : 'Show more'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Transaction Card - only show if there's a transaction hash */}
        {transactionHash && (
          <View style={[styles.card, isDark && styles.darkCard]}>
            <View style={[styles.cardHeader, isDark && styles.darkCardHeader]}>
              <Text style={[styles.cardTitle, isDark && styles.darkText]}>Transaction</Text>
            </View>

            <View style={styles.cardContent}>
              {transactionLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text style={[styles.loadingText, isDark && styles.darkText]}>
                    Processing transaction...
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.transactionContainer}>
                    <Text style={[styles.transactionLabel, isDark && styles.darkText]}>Transaction Hash:</Text>
                    <View style={[styles.transactionData, isDark && styles.darkTransactionData]}>
                      <View style={styles.transactionRow}>
                        <Text style={[styles.transactionText, isDark && styles.darkTransactionText]}>
                          {transactionHash}
                        </Text>
                        <TouchableOpacity 
                          style={styles.viewTxButton}
                          onPress={() => {
                            Clipboard.setString(transactionHash);
                            // Show a toast or feedback that it was copied
                            Alert.alert('Copied', 'Transaction hash copied to clipboard', [
                              { text: 'OK' }
                            ], { cancelable: true });
                          }}
                        >
                          <IconSymbol name="doc.on.doc" weight="medium" color={isDark ? "#FFFFFF" : "#000000"} size={16} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Pass refs instead of direct objects to avoid render issues */}
                  {!transactionLoading && contractRef.current && providerRef.current && (
                    <TransactionEventTracker
                      contract={contractRef.current}
                      transactionHash={transactionHash}
                      provider={providerRef.current}
                    />
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* KRNL Processing Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={krnlModalVisible && loading}
        onRequestClose={() => setKrnlModalVisible(false)}
      >
        <View style={styles.krnlModalOverlay}>
          <View style={[styles.krnlModalContent, isDark && styles.darkKrnlModalContent]}>
            <ActivityIndicator size="large" color="#3B82F6" style={styles.krnlModalLoader} />
            <Text style={[styles.krnlModalStep, isDark && styles.darkText]}>{step}</Text>
          </View>
        </View>
      </Modal>

      {/* Include AppKit component for the wallet modal */}
      <AppKit />
    </SafeAreaView>
  );
}