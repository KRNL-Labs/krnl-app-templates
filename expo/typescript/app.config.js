import 'dotenv/config';

export default {
  name: "KrnlExpoApp",
  slug: "KrnlExpoApp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "krnlexpoapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ],
    "expo-secure-store"
  ],
  experiments: {
    typedRoutes: true
  },
  // Load environment variables from .env file
  extra: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    ENTRY_ID: process.env.ENTRY_ID,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    KERNEL_ID: process.env.KERNEL_ID,
    RPC_KRNL: process.env.RPC_KRNL,
    PROJECT_ID: process.env.PROJECT_ID,
    // Add logger configuration to hide React warnings
    logger: {
      hideReactWarnings: true,
      hideRedBox: true
    }
  }
};
