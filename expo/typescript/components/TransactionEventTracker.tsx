import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import { ethers } from 'krnl-sdk';
import { useColorScheme } from '@/hooks/useColorScheme';
import { styles } from '@/app/styles';

// Define the event data structure based on your contract's Broadcast event
interface BroadcastEvent {
  sender: string;
  score: number;
  message: string;
  blockNumber: number;
  transactionHash: string;
  timestamp?: number;
}

interface TransactionEventTrackerProps {
  contract: ethers.Contract;
  transactionHash: string;
  provider: ethers.Provider;
}

const TransactionEventTracker: React.FC<TransactionEventTrackerProps> = ({
  contract,
  transactionHash,
  provider
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Use refs for mutable values that don't trigger re-renders
  const isMountedRef = useRef<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTransactionHash = useRef<string>(transactionHash);
  const trackingCompleteRef = useRef<boolean>(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const pollAttemptsRef = useRef<number>(0);
  
  // State for UI rendering
  const [event, setEvent] = useState<BroadcastEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Update the ref when transaction hash changes
  useEffect(() => {
    currentTransactionHash.current = transactionHash;
  }, [transactionHash]);
  
  // Function to clear the polling interval
  const clearPollingInterval = useCallback(() => {
    if (intervalRef.current) {
      console.log("Stopping event polling");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // When app comes back to foreground
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('TransactionEventTracker: App came back to foreground');
        
        // If we're still loading and tracking isn't complete, restart polling
        if (loading && !trackingCompleteRef.current && currentTransactionHash.current) {
          console.log('TransactionEventTracker: Restarting polling after app return');
          
          // Clear existing interval if any
          clearPollingInterval();
          
          // Reset poll attempts
          pollAttemptsRef.current = 0;
          
          // Start polling again with a slight delay to let the app stabilize
          setTimeout(() => {
            if (isMountedRef.current) {
              startPolling();
            }
          }, 1000);
        }
      }
      
      appStateRef.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
    };
  }, [loading, clearPollingInterval]);

  // Function to decode the event data from the transaction receipt
  const decodeEvent = useCallback(async () => {
    if (trackingCompleteRef.current) {
      return true; // Skip if already complete
    }
    
    // Get hash from ref to avoid stale closure issues
    const txHash = currentTransactionHash.current;
    
    try {
      console.log("Fetching transaction receipt for:", txHash);
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        console.log("Transaction not mined yet, waiting...");
        
        // Increment poll attempts
        pollAttemptsRef.current += 1;
        
        // If we've tried too many times, give up
        if (pollAttemptsRef.current > 20) {
          if (isMountedRef.current) {
            setError("Transaction is taking too long to mine. Please check the transaction status in your wallet.");
            setLoading(false);
          }
          return true; // Stop polling
        }
        
        return false; // Indicate we should continue polling
      }

      console.log("Received transaction receipt:", receipt);
      
      // Find the Broadcast event in the logs
      if (receipt.logs && receipt.logs.length > 0) {
        let foundEvent = false;
        
        for (const log of receipt.logs) {
          try {
            // Try to parse each log as our event
            const parsedLog = contract.interface.parseLog(log);
            
            if (parsedLog && parsedLog.name === 'Broadcast') {
              console.log("Found Broadcast event:", parsedLog);
              
              // Get block for timestamp
              const block = await provider.getBlock(receipt.blockNumber);
              
              // Create event object
              const broadcastEvent: BroadcastEvent = {
                sender: parsedLog.args[0],
                score: Number(parsedLog.args[1]),
                message: parsedLog.args[2],
                blockNumber: receipt.blockNumber,
                transactionHash: receipt.hash,
                timestamp: block?.timestamp ? Number(block.timestamp) * 1000 : undefined
              };
              
              console.log("Decoded event:", broadcastEvent);
              
              // Mark tracking as complete to prevent further updates
              trackingCompleteRef.current = true;
              foundEvent = true;
              
              // Only update state if component is still mounted
              if (isMountedRef.current) {
                // Use requestAnimationFrame to avoid React state update errors
                requestAnimationFrame(() => {
                  if (isMountedRef.current) {
                    setEvent(broadcastEvent);
                    setLoading(false);
                    setError(null);
                  }
                });
              }
              
              break; // Exit the loop once we find the event
            }
          } catch (parseError) {
            console.log("Log couldn't be parsed as Broadcast event");
            // Continue to the next log
          }
        }
        
        if (!foundEvent && isMountedRef.current) {
          // Use requestAnimationFrame to avoid React state update errors
          requestAnimationFrame(() => {
            if (isMountedRef.current) {
              setError("No Broadcast event found in transaction logs");
              setLoading(false);
            }
          });
        }
        
        return true; // Stop polling since we've checked all logs
      } else {
        if (isMountedRef.current) {
          // Use requestAnimationFrame to avoid React state update errors
          requestAnimationFrame(() => {
            if (isMountedRef.current) {
              setError("No logs found in the transaction receipt");
              setLoading(false);
            }
          });
        }
        return true; // Stop polling since there are no logs
      }
    } catch (err: any) {
      console.error("Error decoding event:", err);
      if (isMountedRef.current) {
        // Use requestAnimationFrame to avoid React state update errors
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setError(err.message || "Failed to decode event");
            setLoading(false);
          }
        });
      }
      return false; // Continue polling in case of errors
    }
  }, [contract, provider]);

  // Start polling function
  const startPolling = useCallback(() => {
    // First try immediately
    decodeEvent().then(shouldStopPolling => {
      if (!isMountedRef.current || trackingCompleteRef.current) return;
      
      // Only set up interval if we should continue polling
      if (!shouldStopPolling) {
        intervalRef.current = setInterval(() => {
          if (!isMountedRef.current || trackingCompleteRef.current) {
            clearPollingInterval();
            return;
          }
          
          decodeEvent().then(shouldStop => {
            if (shouldStop) {
              clearPollingInterval();
            }
          });
        }, 5000);
      }
    });
  }, [decodeEvent, clearPollingInterval]);

  // Effect to initialize and clean up
  useEffect(() => {
    isMountedRef.current = true;
    
    // Reset state when component mounts or transaction hash changes
    // Use requestAnimationFrame to avoid React state update errors
    requestAnimationFrame(() => {
      if (isMountedRef.current) {
        setEvent(null);
        setLoading(true);
        setError(null);
      }
    });
    
    trackingCompleteRef.current = false;
    pollAttemptsRef.current = 0;
    
    // Clear any existing interval
    clearPollingInterval();
    
    // Only start polling if we have all required props
    if (contract && transactionHash && provider) {
      // Start with a slight delay to ensure app is stable
      setTimeout(() => {
        if (isMountedRef.current) {
          startPolling();
        }
      }, 500);
    }
    
    return () => {
      isMountedRef.current = false;
      clearPollingInterval();
    };
  }, [transactionHash, contract, provider, clearPollingInterval, startPolling]);

  // Format timestamp to human-readable format
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Unknown time';
    return new Date(timestamp).toLocaleString();
  };

  // If any required prop is missing, don't render anything
  if (!transactionHash || !contract || !provider) {
    return null;
  }

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.transactionLabel, isDark && styles.darkText]}>Decoded Response:</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={[styles.loadingText, isDark && styles.darkText]}>
            Waiting for transaction to be mined...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : event ? (
        <View style={[styles.transactionData, isDark && styles.darkTransactionData]}>
          <View style={styles.eventRow}>
            <Text style={[styles.eventLabel, isDark && styles.darkText]}>From:</Text>
            <Text style={[styles.transactionText, isDark && styles.darkTransactionText]}>
              {event.sender.slice(0, 6)}...{event.sender.slice(-4)}
            </Text>
          </View>
          
          <View style={styles.eventRow}>
            <Text style={[styles.eventLabel, isDark && styles.darkText]}>Score:</Text>
            <Text style={[styles.transactionText, isDark && styles.darkTransactionText]}>
              {event.score}
            </Text>
          </View>
          
          
          <View style={styles.eventRow}>
            <Text style={[styles.eventLabel, isDark && styles.darkText]}>Block:</Text>
            <Text style={[styles.transactionText, isDark && styles.darkTransactionText]}>
              {event.blockNumber}
            </Text>
          </View>
          
          <View style={styles.eventRow}>
            <Text style={[styles.eventLabel, isDark && styles.darkText]}>Time:</Text>
            <Text style={[styles.transactionText, isDark && styles.darkTransactionText]}>
              {formatTimestamp(event.timestamp)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isDark && styles.darkText]}>
            No event data found for this transaction.
          </Text>
        </View>
      )}
    </View>
  );
};

export default TransactionEventTracker;