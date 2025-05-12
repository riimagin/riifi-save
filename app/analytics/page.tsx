"use client"

import { useState, useEffect } from "react"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  BadgeDollarSign,
  CalendarClock,
  Download,
  LineChart,
  PiggyBank,
  Target,
  Wallet,
  Loader2
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAccount, useBalance, useContractRead } from 'wagmi'
import { SAVINGS_CONTRACT_ABI, SAVINGS_CONTRACT_ADDRESS, type PlanDetails, SavingsType } from "@/lib/contract"
import { Wallet as OnchainWallet } from '@coinbase/onchainkit/wallet'

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<{ id: number; details: PlanDetails }[]>([])
  const [period, setPeriod] = useState('6months')

  // Get balance
  const { data: balance } = useBalance({
    address,
    token: SAVINGS_CONTRACT_ADDRESS,
  })

  // Get user's plans count
  const { data: plansCount } = useContractRead({
    address: SAVINGS_CONTRACT_ADDRESS,
    abi: SAVINGS_CONTRACT_ABI,
    functionName: 'getUserPlansCount',
    args: [],
  })

  // Get flexible balance
  const { data: flexibleBalance } = useContractRead({
    address: SAVINGS_CONTRACT_ADDRESS,
    abi: SAVINGS_CONTRACT_ABI,
    functionName: 'getFlexibleBalance',
    args: address ? [address] : undefined,
  })

  // Load user's plans
  const loadPlans = async () => {
    if (!isConnected || !plansCount || !address) return

    setLoading(true)
    try {
      const planIds = Array.from({ length: Number(plansCount) }, (_, i) => i)
      
      const planDetails = await Promise.all(
        planIds.map(id => 
          useContractRead({
            address: SAVINGS_CONTRACT_ADDRESS,
            abi: SAVINGS_CONTRACT_ABI,
            functionName: 'getPlanDetails',
            args: [BigInt(id)],
          }).data
        )
      )

      const plansData = planDetails.map((details, id) => {
        if (!details) return null
        return {
          id,
          details: {
            savingsType: Number(details[4]), // savingsType is at index 4
            balance: BigInt(details[0].toString()), // balance is at index 0
            target: BigInt(details[1].toString()), // target is at index 1
            lockPeriod: BigInt(details[2].toString()), // lockPeriodEnd is at index 2
            active: Boolean(details[5]), // active is at index 5
          } as PlanDetails,
        }
      }).filter((plan): plan is NonNullable<typeof plan> => plan !== null)

      setPlans(plansData)
    } catch (error) {
      console.error("Error loading plans:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load plans when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      loadPlans()
    }
  }, [isConnected, address, plansCount])

  // Calculate analytics
  const analytics = {
    totalSavings: balance ? Number(formatUnits(balance.value, balance.decimals)) : 0,
    totalDeposits: plans.reduce((acc, plan) => acc + Number(formatUnits(plan.details.balance, 6)), 0),
    goalProgress: plans
      .filter(plan => plan.details.savingsType === SavingsType.GOAL_BASED)
      .reduce((acc, plan) => {
        const progress = (Number(plan.details.balance) / Number(plan.details.target)) * 100
        return acc + progress
      }, 0) / Math.max(plans.filter(plan => plan.details.savingsType === SavingsType.GOAL_BASED).length, 1),
    flexibleBalance: flexibleBalance ? Number(formatUnits(flexibleBalance, 6)) : 0,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm md:text-base text-muted-foreground">Track and analyze your savings performance.</p>
      </div>

      {!isConnected ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <LineChart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connect Wallet to View Analytics</h2>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Connect your wallet to view detailed analytics of your savings performance.
            </p>
            <OnchainWallet />
          </div>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <ScrollArea className="w-full sm:w-auto">
                  <div className="flex pb-2 sm:pb-0">
                    <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="goals">Goals</TabsTrigger>
                      <TabsTrigger value="time">Time</TabsTrigger>
                      <TabsTrigger value="flexible">Flexible</TabsTrigger>
                    </TabsList>
                  </div>
                </ScrollArea>
                <div className="flex items-center gap-2">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="3months">Last 3 months</SelectItem>
                      <SelectItem value="6months">Last 6 months</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="hidden sm:flex">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download report</span>
                  </Button>
                </div>
              </div>

              <TabsContent value="overview" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                      <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${analytics.totalSavings.toFixed(2)}</div>
                      <div className="flex items-center text-xs text-emerald-500">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        Active savings
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                      <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${analytics.totalDeposits.toFixed(2)}</div>
                      <div className="flex items-center text-xs text-emerald-500">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        All time deposits
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Flexible Balance</CardTitle>
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${analytics.flexibleBalance.toFixed(2)}</div>
                      <div className="flex items-center text-xs text-emerald-500">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        Available for withdrawal
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Math.round(analytics.goalProgress)}%</div>
                      <div className="flex items-center text-xs text-emerald-500">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        Average completion
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 mt-6 md:grid-cols-2">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Savings Growth</CardTitle>
                      <CardDescription>Your total savings over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] md:h-[300px] flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center bg-muted/40 rounded-md">
                        <LineChart className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Savings Growth Chart</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Savings Distribution</CardTitle>
                      <CardDescription>Breakdown of your savings by type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] md:h-[300px] flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center bg-muted/40 rounded-md">
                        <PiggyBank className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Savings Distribution Chart</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="goals" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Goal-based Savings Analysis</CardTitle>
                    <CardDescription>Track progress towards your financial goals</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] md:h-[400px] flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center bg-muted/40 rounded-md">
                      <Target className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Goal Progress Chart</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="time" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Time-based Savings Analysis</CardTitle>
                    <CardDescription>Track your time-based savings plans</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] md:h-[400px] flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center bg-muted/40 rounded-md">
                      <CalendarClock className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Time-based Savings Chart</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flexible" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Flexible Savings Analysis</CardTitle>
                    <CardDescription>Track your flexible savings accounts</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] md:h-[400px] flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center bg-muted/40 rounded-md">
                      <Wallet className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Flexible Savings Chart</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}
