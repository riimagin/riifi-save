"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from "viem"
import { SAVINGS_CONTRACT_ABI, SAVINGS_CONTRACT_ADDRESS, SavingsType } from "@/lib/contract"

interface CreatePlanDialogProps {
  onSuccess?: () => void
  children?: React.ReactNode
  defaultType?: SavingsType
}

export default function CreatePlanDialog({ onSuccess, children, defaultType }: CreatePlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [savingsType, setSavingsType] = useState<SavingsType>(defaultType ?? SavingsType.FLEXIBLE)
  const [target, setTarget] = useState("")
  const [duration, setDuration] = useState("")
  const { toast } = useToast()
  const { isConnected } = useAccount()

  const { data: hash, isPending, error, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    onSuccess: () => {
      setOpen(false)
      toast({
        title: "Success",
        description: "Your savings plan has been created!",
      })
      onSuccess?.()
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    try {
      const amountInWei = parseUnits(amount, 6) // USDC has 6 decimals
      const targetInWei = target ? parseUnits(target, 6) : BigInt(0)
      const durationInSeconds = duration ? BigInt(parseInt(duration) * 24 * 60 * 60) : BigInt(0)

      writeContract({
        address: SAVINGS_CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'createSavingsPlan',
        args: [savingsType, targetInWei, durationInSeconds],
      })
    } catch (err) {
      console.error("Error creating plan:", err)
      toast({
        title: "Error",
        description: "Invalid input values. Please check and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            Create New Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Savings Plan</DialogTitle>
            <DialogDescription>
              Set up a new savings plan with your preferred parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Initial Deposit (USDC)</label>
              <Input
                type="number"
                step="0.000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid gap-2">
              <label>Plan Type</label>
              <Select value={savingsType.toString()} onValueChange={(value) => setSavingsType(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SavingsType.FLEXIBLE.toString()}>Flexible</SelectItem>
                  <SelectItem value={SavingsType.GOAL_BASED.toString()}>Goal-based</SelectItem>
                  <SelectItem value={SavingsType.TIME_BASED.toString()}>Time-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {savingsType === SavingsType.GOAL_BASED && (
              <div className="grid gap-2">
                <label>Target Amount (USDC)</label>
                <Input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            )}
            {savingsType === SavingsType.TIME_BASED && (
              <div className="grid gap-2">
                <label>Lock Duration (Days)</label>
                <Input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || isConfirming}>
              {isPending || isConfirming ? "Creating..." : "Create Plan"}
            </Button>
          </DialogFooter>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              Error: {error.message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
