"use client"

import { useCallback, useEffect, useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Wallet } from '@coinbase/onchainkit/wallet'

export function ConnectAndSIWE() {
  const account = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [message, setMessage] = useState<SiweMessage | undefined>(undefined)
  const [signature, setSignature] = useState<`0x${string}` | undefined>(undefined)
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  const handleSignMessage = useCallback(async () => {
    if (!account.address || !account.chainId) return;
    
    try {
      const m = new SiweMessage({
        domain: window.location.host,
        address: account.address,
        chainId: account.chainId,
        uri: window.location.origin,
        version: "1",
        statement: "Sign in to RiiFI Platform",
        nonce: "12345678", // In production, this should be randomly generated
      })
      setMessage(m)
      
      const sig = await signMessageAsync({ 
        message: m.prepareMessage() 
      })
      setSignature(sig)
    } catch (err) {
      console.error("SIWE error:", err)
      setError('Failed to sign message')
    }
  }, [account.address, account.chainId, signMessageAsync])

  useEffect(() => {
    if (account.address && !message) {
      handleSignMessage()
    }
  }, [account.address, message, handleSignMessage])

  return (
    <div className="flex flex-col items-center gap-4">
      <Wallet />
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
      {valid !== undefined && (
        <p className={`text-sm ${valid ? "text-green-500" : "text-red-500"}`}>
          Signature verification: {valid ? "Valid" : "Invalid"}
        </p>
      )}
    </div>
  )
} 