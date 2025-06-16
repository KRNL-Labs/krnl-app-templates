import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import KrnlLogo from './KrnlLogo';

// Define network types - same as in your index.tsx file
const NETWORKS = {
  sepolia: {
    name: 'Sepolia',
    chainId: '0xaa36a7',
  },
  // optimism: {
  //   name: 'Optimism Sepolia',
  //   chainId: '0xaa37dc',
  // },
  // base: {
  //   name: 'Base Sepolia',
  //   chainId: '0x14a34',
  // },
};

interface HeaderProps {
  selectedNetwork: string;
  setNetworkModalVisible: (visible: boolean) => void;
  isConnected: boolean;
  address?: string;
  connectWallet: () => void;
  disconnectWallet: () => void;
  handleNetworkSwitch: (network: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedNetwork,
  isConnected,
  address,
  connectWallet,
  disconnectWallet,
  handleNetworkSwitch,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [localIsConnected, setLocalIsConnected] = useState(isConnected);
  
  // Ensure local state stays in sync with props
  useEffect(() => {
    console.log("Header: isConnected changed to", isConnected);
    setLocalIsConnected(isConnected);
    
    // If disconnected, ensure menu is closed
    if (!isConnected && menuVisible) {
      setMenuVisible(false);
    }
  }, [isConnected, menuVisible]);
  
  return (
    <View style={styles.header}>
      {/* Left side - KRNL Expo logo */}
      <View style={styles.logoContainer}>
        <KrnlLogo width={28} height={28} style={styles.logo} />
        <Text style={styles.title}>
          KRNL <Text style={styles.titleBlue}>Template</Text>
        </Text>
      </View>

      {/* Right side - Wallet connection */}
      <View style={styles.rightContainer}>
        {localIsConnected && address ? (
          <>
            {/* Address button */}
            <TouchableOpacity style={styles.walletButton}>
              <Text style={styles.walletButtonText}>
                {`${address.slice(0, 4)}...${address.slice(-2)}`}
              </Text>
            </TouchableOpacity>
            
            {/* Menu button */}
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setMenuVisible(true)}
            >
              <Feather name="menu" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : (
          /* Connect wallet button if not connected */
          <TouchableOpacity
            style={styles.connectButton}
            onPress={connectWallet}
          >
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>
            
            {/* Network selection */}
            <Text style={styles.menuSectionTitle}>Network</Text>
            {Object.entries(NETWORKS).map(([key, network]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.menuItem,
                  selectedNetwork === key && styles.selectedMenuItem
                ]}
                onPress={() => {
                  handleNetworkSwitch(key);
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.menuItemText}>
                  {network.name} {selectedNetwork === key ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Disconnect option */}
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.disconnectMenuItem}
              onPress={() => {
                disconnectWallet();
                setMenuVisible(false);
              }}
            >
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
            
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: '#000000',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    color: '#FFFFFF',
  },
  titleBlue: {
    color: '#001EFE',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  menuButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AAAAAA',
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  selectedMenuItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  disconnectMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  disconnectText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  }
});

export default Header;