/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_ENTRY_ID: string;
  readonly VITE_ACCESS_TOKEN: string;
  readonly VITE_KERNEL_ID: string;
  readonly VITE_RPC_KRNL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
