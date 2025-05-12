"use client"

import { useState, useEffect } from "react"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ChevronRight, Clock, Plus, Target, Wallet, Coins, TrendingUp, Sparkles, Loader2, BadgeDollarSign } from "lucide-react"
import Link from "next/link"
import { useAccount, useBalance, useContractRead, useContractReads } from 'wagmi'
import CreatePlanDialog from "@/components/create-plan-dialog"
import { SAVINGS_CONTRACT_ABI, SAVINGS_CONTRACT_ADDRESS, type PlanDetails, SavingsType } from "@/lib/contract"
import { Wallet as OnchainWallet } from '@coinbase/onchainkit/wallet'
import { cn } from "@/lib/utils"
import { ConnectAndSIWE } from "@/components/connect-and-siwe"

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<{ id: number; details: PlanDetails }[]>([])
  const [goalPlansCount, setGoalPlansCount] = useState(0)
  const [timePlansCount, setTimePlansCount] = useState(0)

  // Get total balance
  const { data: balance } = useBalance({
    address,
    token: SAVINGS_CONTRACT_ADDRESS,
    query: {
      refetchInterval: 2000, // Refetch every 2 seconds
    }
  })

  // Get flexible balance with real-time updates
  const { data: flexibleBalance } = useContractRead({
    address: SAVINGS_CONTRACT_ADDRESS,
    abi: SAVINGS_CONTRACT_ABI,
    functionName: 'getFlexibleBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 2000,
    }
  })

  // Get user's plans count with real-time updates
  const { data: plansCount } = useContractRead({
    address: SAVINGS_CONTRACT_ADDRESS,
    abi: SAVINGS_CONTRACT_ABI,
    functionName: 'getUserPlansCount',
    args: [],
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 2000,
    }
  })

  // Load user's plans with real-time updates
  useEffect(() => {
    const loadPlans = async () => {
      if (!isConnected || !plansCount || !address) return

      setLoading(true)
      try {
        const planIds = Array.from({ length: Number(plansCount) }, (_, i) => i)
        
        // Create contract reads configuration for batch fetching
        const contractReads = planIds.map(id => ({
          address: SAVINGS_CONTRACT_ADDRESS,
          abi: SAVINGS_CONTRACT_ABI,
          functionName: 'getPlanDetails',
          args: [BigInt(id)],
        }))

        // Use useContractReads for efficient batch fetching
        const { data: planDetailsArray } = await useContractReads({
          contracts: contractReads,
          query: {
            enabled: isConnected && !!address,
            refetchInterval: 2000,
          }
        })

        const plansData = (planDetailsArray || []).map((details, id) => {
          if (!details?.result) return null
          const result = details.result as any
          return {
            id,
            details: {
              savingsType: Number(result[4]), // savingsType is at index 4
              balance: BigInt(result[0].toString()), // balance is at index 0
              target: BigInt(result[1].toString()), // target is at index 1
              lockPeriod: BigInt(result[2].toString()), // lockPeriodEnd is at index 2
              active: Boolean(result[5]), // active is at index 5
            } as PlanDetails,
          }
        }).filter((plan): plan is NonNullable<typeof plan> => plan !== null)

        let goalCount = 0
        let timeCount = 0

        plansData.forEach(({ details }) => {
          if (details.active) {
            if (details.savingsType === SavingsType.GOAL_BASED) {
              goalCount++
            } else if (details.savingsType === SavingsType.TIME_BASED) {
              timeCount++
            }
          }
        })

        setPlans(plansData)
        setGoalPlansCount(goalCount)
        setTimePlansCount(timeCount)
      } catch (error) {
        console.error("Error loading plans:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPlans()

    // Set up polling interval
    const interval = setInterval(loadPlans, 2000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [isConnected, address, plansCount])

  // Calculate total savings growth (example calculation)
  const calculateGrowth = (currentBalance: bigint, previousBalance: bigint) => {
    if (previousBalance === 0n) return "+0.00%"
    const growth = ((currentBalance - previousBalance) * 100n) / previousBalance
    return `+${formatUnits(growth, 2)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pb-8">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              RiiFI Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Overview of your RiiFI savings and investment plans.
            </p>
          </div>

          {!isConnected ? (
            <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex flex-col items-center justify-center py-16 gap-6">
                <div className="rounded-full bg-gradient-to-br from-primary to-primary/80 p-6 shadow-lg shadow-primary/20">
                  <Wallet className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">Connect Wallet to Access Dashboard</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Please use the connect button in the header to access your RiiFI dashboard.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Total Balance",
                    value: balance ? `$${formatUnits(balance.value, balance.decimals)}` : "$0.00",
                    description: "Total value across all plans",
                    icon: BadgeDollarSign,
                    trend: "+12.5%",
                    trendUp: true
                  },
                  {
                    title: "Flexible Savings",
                    value: flexibleBalance ? `$${formatUnits(flexibleBalance, 6)}` : "$0.00",
                    description: "Available for instant withdrawal",
                    icon: Coins,
                    trend: "+5.2%",
                    trendUp: true
                  },
                  {
                    title: "Goal-based Plans",
                    value: goalPlansCount,
                    description: "Active savings goals",
                    icon: Target
                  },
                  {
                    title: "Time-locked Plans",
                    value: timePlansCount,
                    description: "Active time-based plans",
                    icon: Clock
                  }
                ].map((item, index) => (
                  <Card key={index} className="transition-all duration-200 hover:shadow-md hover:border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      <div className="rounded-full bg-primary/10 p-2">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold">{item.value}</div>
                        {item.trend && (
                          <span className={cn(
                            "text-xs font-medium",
                            item.trendUp ? "text-green-500" : "text-red-500"
                          )}>
                            {item.trend}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="transition-all duration-200 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Quick Actions</span>
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription>Create new savings plans or manage existing ones.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <CreatePlanDialog>
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Plan
                      </Button>
                    </CreatePlanDialog>
                    <Link href="/savings" passHref>
                      <Button variant="outline" className="w-full group">
                        <TrendingUp className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        View All Plans
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-200 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Recent Activity</span>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription>Your latest savings activities.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : plans.length > 0 ? (
                      <div className="space-y-4">
                        {plans.slice(0, 3).map((plan) => (
                          <div key={plan.id} 
                               className="flex items-center justify-between p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-primary/10 p-2">
                                {plan.details.savingsType === SavingsType.FLEXIBLE && <Coins className="h-4 w-4 text-primary" />}
                                {plan.details.savingsType === SavingsType.GOAL_BASED && <Target className="h-4 w-4 text-primary" />}
                                {plan.details.savingsType === SavingsType.TIME_BASED && <Clock className="h-4 w-4 text-primary" />}
                              </div>
                              <span className="font-medium">Plan #{plan.id}</span>
                            </div>
                            <span className="font-medium">${formatUnits(plan.details.balance, 6)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Target className="h-12 w-12 mb-4 text-primary/50" />
                        <p>No savings plans yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="transition-all duration-200 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Savings Tips</span>
                      <Sparkles className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription>Tips to help you save more effectively.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { icon: Sparkles, text: "Set clear savings goals" },
                        { icon: Clock, text: "Use time-locked savings for discipline" },
                        { icon: Target, text: "Track your progress regularly" }
                      ].map((tip, index) => (
                        <div key={index} 
                             className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div className="rounded-full bg-primary/10 p-2">
                            <tip.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{tip.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
