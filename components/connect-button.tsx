import { Wallet } from '@coinbase/onchainkit/wallet';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

export function CustomConnectButton() {
  const { isConnecting } = useAccount();

  return (
    <div className="w-full">
      <Wallet 
        className="w-full"
      />
    </div>
  );
} 