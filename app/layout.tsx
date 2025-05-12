import '@coinbase/onchainkit/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';
import Providers from './providers';
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import MobileNav from "@/components/mobile-nav"
import { Toaster } from "@/components/ui/toaster"
import { headers } from "next/headers"
import { CryptoPolyfillScript } from './crypto-polyfill-script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RiiFI - Base Network',
  description: 'A decentralized savings platform on Base',
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
            <div className="flex flex-col h-screen overflow-hidden">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0 gradient-bg">
                  <div className="container mx-auto px-3 py-3 md:px-4 md:py-6 max-w-6xl">{props.children}</div>
                </main>
              </div>
              <MobileNav />
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
