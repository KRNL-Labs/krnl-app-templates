import "@walletconnect/react-native-compat";
import { WagmiProvider } from "wagmi";
import { sepolia, optimismSepolia, baseSepolia } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createAppKit,
  defaultWagmiConfig,
  AppKit,
} from "@reown/appkit-wagmi-react-native";

// 0. Setup queryClient
export const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.reown.com
export const projectId = "5c6a79ef72d5c180931733dc0b6d8d1c";

// 2. Create config
const metadata = {
  name: "KRNL Expo App",
  description: "KRNL Expo App",
  url: "https://reown.com/appkit",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
  redirect: {
    native: "krnlexpoapp://",
    universal: "krnlexpoapp.com",
  },
};

const chains = [sepolia, optimismSepolia, baseSepolia] as const;

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: sepolia, // Optional
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});