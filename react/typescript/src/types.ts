// Network configuration interface
export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconColor: string;
  icon: string;
}

export interface Networks {
  [key: string]: NetworkConfig;
}

// Event data interface
export interface EventData {
  sender: string;
  data: number;
  message: string;
  blockNumber: number;
}

// KRNL kernel payload interface
export interface KernelPayloadItem {
  functionParams: string;
}

// KRNL kernel request data interface
export interface KernelRequestData {
  senderAddress: string;
  kernelPayload: {
    [kernelId: string]: KernelPayloadItem;
  };
}

// KRNL payload interface
export interface KrnlPayload {
  auth?: string;
  kernel_responses?: any;
  kernel_params?: any;
  [key: string]: any;
}

// Ethereum window interface
export interface EthereumWindow extends Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
}
