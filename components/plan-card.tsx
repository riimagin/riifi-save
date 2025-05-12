"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  SAVINGS_CONTRACT_ABI,
  SAVINGS_CONTRACT_ADDRESS,
  USDC_ABI,
  USDC_CONTRACT_ADDRESS,
  SavingsType,
  type PlanDetails,
  formatUSDC,
  parseUSDC,
  getSavingsTypeName,
  formatDate,
  calculateProgress,
  daysRemaining,
} from "@/lib/contract"
import { ArrowDown, ArrowUp, Clock, Coins, Loader2, Target, Wallet, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { cn } from "@/lib/utils"

interface PlanCardProps {
  planId: number
  planDetails: PlanDetails
  onUpdateAction: () => void
}

export default function PlanCard({ planId, planDetails, onUpdateAction }: PlanCardProps) {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const { toast } = useToast()
  const { isConnected } = useAccount()

  const { data: depositHash, isPending: isDepositPending, error: depositError, writeContract: writeDeposit } = useWriteContract()
  const { data: withdrawHash, isPending: isWithdrawPending, error: withdrawError, writeContract: writeWithdraw } = useWriteContract()

  useEffect(() => {
    if (depositHash) {
      const checkDeposit = async () => {
        try {
          const receipt = await useWaitForTransactionReceipt({ hash: depositHash })
          if (receipt) {
            setIsDepositOpen(false)
            setDepositAmount("")
            toast({
              title: "Success",
              description: "Your deposit has been processed!",
            })
            onUpdateAction()
          }
        } catch (error) {
          console.error("Error confirming deposit:", error)
        }
      }
      checkDeposit()
    }
  }, [depositHash])

  useEffect(() => {
    if (withdrawHash) {
      const checkWithdraw = async () => {
        try {
          const receipt = await useWaitForTransactionReceipt({ hash: withdrawHash })
          if (receipt) {
            setIsWithdrawOpen(false)
            setWithdrawAmount("")
            toast({
              title: "Success",
              description: "Your withdrawal has been processed!",
            })
            onUpdateAction()
          }
        } catch (error) {
          console.error("Error confirming withdrawal:", error)
        }
      }
      checkWithdraw()
    }
  }, [withdrawHash])

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    try {
      const amountInWei = parseUSDC(depositAmount)

      writeDeposit({
        address: SAVINGS_CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'deposit',
        args: [BigInt(planId), amountInWei],
      })
    } catch (err) {
      console.error("Error depositing:", err)
      toast({
        title: "Error",
        description: "Invalid deposit amount. Please check and try again.",
        variant: "destructive",
      })
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    try {
      const amountInWei = parseUSDC(withdrawAmount)

      writeWithdraw({
        address: SAVINGS_CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'withdraw',
        args: [BigInt(planId), amountInWei],
      })
    } catch (err) {
      console.error("Error withdrawing:", err)
      toast({
        title: "Error",
        description: "Invalid withdrawal amount. Please check and try again.",
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = () => {
    switch (planDetails.savingsType) {
      case SavingsType.GOAL_BASED:
        return <Target className="h-5 w-5 text-green-500" />
      case SavingsType.TIME_BASED:
        return <Clock className="h-5 w-5 text-orange-500" />
      case SavingsType.FLEXIBLE:
        return <Coins className="h-5 w-5 text-blue-500" />
    }
  }

  const getTypeColor = () => {
    switch (planDetails.savingsType) {
      case SavingsType.GOAL_BASED:
        return "from-green-500/10 to-green-500/5"
      case SavingsType.TIME_BASED:
        return "from-orange-500/10 to-orange-500/5"
      case SavingsType.FLEXIBLE:
        return "from-blue-500/10 to-blue-500/5"
    }
  }

  const progress = planDetails.savingsType === SavingsType.GOAL_BASED 
    ? calculateProgress(planDetails.balance, planDetails.target)
    : 0

  const formatBalance = (balance: bigint) => {
    const formatted = formatUSDC(balance)
    const [whole, decimal] = formatted.split('.')
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">${whole}</span>
        {decimal && <span className="text-sm text-muted-foreground">.{decimal}</span>}
      </div>
    )
  }

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      "bg-gradient-to-br h-full",
      getTypeColor()
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-background/50 backdrop-blur p-2 mt-1">
              {getTypeIcon()}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold leading-none mb-1.5">
                {getSavingsTypeName(planDetails.savingsType)}
              </CardTitle>
              <CardDescription className="text-xs">
                Plan ID: {planId.toString().padStart(3, '0')}
              </CardDescription>
            </div>
          </div>
          <div className="rounded-full bg-background/50 backdrop-blur p-2">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-background/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Current Balance</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              {formatBalance(planDetails.balance)}
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                USDC
              </div>
            </div>
          </div>
          
          {planDetails.savingsType === SavingsType.GOAL_BASED && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Target Goal</span>
                <div className="text-right">
                  {formatBalance(planDetails.target)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    ${formatUSDC(planDetails.balance)} saved
                  </span>
                  <span className="text-muted-foreground">
                    ${formatUSDC(planDetails.target - planDetails.balance)} to go
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {planDetails.savingsType === SavingsType.TIME_BASED && (
            <div className="p-4 rounded-xl bg-background/50 backdrop-blur space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Lock Period</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold">
                    {daysRemaining(planDetails.lockPeriod)}
                  </span>
                  <span className="text-sm text-muted-foreground">days remaining</span>
                </div>
                <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                    style={{ 
                      width: `${(Number(planDetails.lockPeriod) / (365 * 24 * 60 * 60)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {planDetails.savingsType === SavingsType.FLEXIBLE && (
            <div className="p-4 rounded-xl bg-background/50 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Flexible Savings</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Withdraw your funds at any time with no lock period
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              className="flex-1 bg-background/50 backdrop-blur hover:bg-background/80 transition-all duration-300"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Deposit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleDeposit}>
              <DialogHeader>
                <DialogTitle>Deposit USDC</DialogTitle>
                <DialogDescription>
                  Enter the amount of USDC you want to deposit into this savings plan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isDepositPending}>
                  {isDepositPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Depositing...
                    </>
                  ) : (
                    "Deposit"
                  )}
                </Button>
              </DialogFooter>
              {depositError && (
                <div className="text-red-500 text-sm mt-2">
                  Error: {depositError.message}
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              className="flex-1 bg-background/50 backdrop-blur hover:bg-background/80 transition-all duration-300"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleWithdraw}>
              <DialogHeader>
                <DialogTitle>Withdraw USDC</DialogTitle>
                <DialogDescription>
                  Enter the amount of USDC you want to withdraw from this savings plan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isWithdrawPending}>
                  {isWithdrawPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </DialogFooter>
              {withdrawError && (
                <div className="text-red-500 text-sm mt-2">
                  Error: {withdrawError.message}
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
