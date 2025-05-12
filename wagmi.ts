import { http, createConfig } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { type Chain } from "viem";
import { coinbaseWallet } from 'wagmi/connectors';

// Hardcoded configuration values
const WALLET_CONNECT_PROJECT_ID = '48811b90db8e351a32e111b328588ade';
const BASE_RPC_URL = 'https://mainnet.base.org';
const BASE_SEPOLIA_RPC_URL = 'https://sepolia.base.org';

// Configure chains
const chains = [base, baseSepolia] as const;

// Configure HTTP clients with longer timeouts and better retry strategy
const baseSepoliaTransport = http(BASE_SEPOLIA_RPC_URL, {
  timeout: 30_000, // 30 seconds
  retryCount: 3,
  retryDelay: 3000, // 3 seconds between retries
  batch: {
    batchSize: 500,
    wait: 100,
  },
});

const baseTransport = http(BASE_RPC_URL, {
  timeout: 30_000,
  retryCount: 3,
  retryDelay: 3000,
  batch: {
    batchSize: 500,
    wait: 100,
  },
});

// Configure wagmi
export const config = createConfig({
  chains,
  transports: {
    [baseSepolia.id]: baseSepoliaTransport,
    [base.id]: baseTransport,
  },
  connectors: [
    coinbaseWallet({
      appName: 'RiiFI Platform',
    }),
  ],
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
} 