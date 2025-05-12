import '@coinbase/onchainkit/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';
import Providers from './providers';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { headers } from "next/headers"
import { CryptoPolyfillScript } from './crypto-polyfill-script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RiiFI - Decentralized Savings Platform',
  description: 'The future of DeFi savings - secure, flexible, and high-yield savings solutions on Base Network',
  keywords: 'DeFi, savings, cryptocurrency, blockchain, Base Network, yield farming, staking',
};

export default async function RootLayout(props: { children: ReactNode }) {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CryptoPolyfillScript />
      </head>
      <body className={inter.className}>
        <Providers cookie={cookie}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {props.children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
