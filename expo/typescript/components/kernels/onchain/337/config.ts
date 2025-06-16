// Import the ABI from the abi.json file
import abi from '../../../../mainContract/abi.json';
import Constants from 'expo-constants';

// Access environment variables from Expo Constants
const env = Constants.expoConfig?.extra || {};

// Define contract address with fallback
export const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS as string || '0x0000000000000000000000000000000000000000';

// Define entry ID and access token with fallbacks
export const ENTRY_ID = env.ENTRY_ID as string || '';
export const ACCESS_TOKEN = env.ACCESS_TOKEN as string || '';
export const KERNEL_ID = env.KERNEL_ID as string || '337';

// Export the contract config
export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi,
  entryId: ENTRY_ID,
  accessToken: ACCESS_TOKEN,
  kernelId: KERNEL_ID
};

// Re-export the ABI for convenience
export { abi };