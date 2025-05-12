import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { base } from 'wagmi/chains';

// Initialize Coinbase Wallet SDK
export const coinbaseWallet = new CoinbaseWalletSDK({
  appName: 'RiiFI Platform'
});

// Get the provider
export const provider = coinbaseWallet.makeWeb3Provider();

// Enable the provider
export async function enableCoinbaseWallet(): Promise<string | null> {
  try {
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    }) as string[];
    return accounts[0] || null;
  } catch (error) {
    console.error('Failed to enable Coinbase Wallet:', error);
    throw error;
  }
}

// Get chain ID
export async function getChainId(): Promise<number> {
  try {
    const chainId = await provider.request({
      method: 'eth_chainId'
    }) as string;
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    throw error;
  }
}

// Switch to Base chain
export async function switchToBase(): Promise<void> {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${base.id.toString(16)}` }],
    });
  } catch (error) {
    console.error('Failed to switch to Base:', error);
    throw error;
  }
}