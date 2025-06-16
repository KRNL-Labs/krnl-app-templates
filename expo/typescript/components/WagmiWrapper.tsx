import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, queryClient } from '@/utils/wallet-config';

/*
 * This wrapper component isolates Wagmi initialization from the rest of the app
 * and handles wallet connection in React Native
 */
export default function WagmiWrapper({ children }: { children: React.ReactNode }) {
  // Using refs avoids state updates during render
  const isInitialRender = useRef(true);
  const [isReady, setIsReady] = useState(false);
  const appStateRef = useRef(AppState.currentState);
  
  // Initial setup effect - only runs once
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      console.log('WagmiWrapper: Initial setup');
      
      // Use a delay to ensure all components are fully mounted
      const timer = setTimeout(() => {
        console.log('WagmiWrapper: Initial timeout complete');
        setIsReady(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Handle app state changes
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // When app comes back to foreground
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('WagmiWrapper: App came back to foreground, refreshing state');
      
      // Force refresh the QueryClient to update Wagmi state
      queryClient.invalidateQueries();
    }
    
    // Update the app state ref
    appStateRef.current = nextAppState;
  };
  
  if (!isReady) {
    // Show a loading indicator while initializing
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  
  // Wrap the WagmiProvider in a try-catch to prevent errors from bubbling up
  try {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    );
  } catch (error) {
    console.log('Caught error in WagmiProvider:', error);
    // Return children without the provider in case of error
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }
}