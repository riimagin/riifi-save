'use client';

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState } from "wagmi";
import { config } from "@/wagmi";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { base, baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from '@coinbase/onchainkit';

// Hardcoded configuration values
const WALLET_CONNECT_PROJECT_ID = '48811b90db8e351a32e111b328588ade';

// Configure React Query with retries and longer timeouts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 60000),
      staleTime: 10000,
      networkMode: 'always',
    },
    mutations: {
      retry: 5,
      retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 60000),
      networkMode: 'always',
    },
  },
});

type Props = {
  children: React.ReactNode;
  cookie?: string | null;
};

export default function Providers({ children, cookie }: Props) {
  const initialState = cookie ? cookieToInitialState(config, cookie) : undefined;
  const { toast } = useToast();
  
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
          chain={base}
          projectId={WALLET_CONNECT_PROJECT_ID}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 