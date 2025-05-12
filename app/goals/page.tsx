"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeDollarSign, Home, Plus, Target, Coins, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CurrencyDisplay } from "@/components/currency-display"
import { useAccount, useContractRead } from 'wagmi'
import { SAVINGS_CONTRACT_ABI, SAVINGS_CONTRACT_ADDRESS, type PlanDetails, SavingsType } from "@/lib/contract"
import { Wallet } from '@coinbase/onchainkit/wallet'
import CreatePlanDialog from "@/components/create-plan-dialog"

export default function GoalsPage() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<{ id: number; details: PlanDetails }[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'short' | 'long'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user's plans count
  const { data: plansCount } = useContractRead({
    address: SAVINGS_CONTRACT_ADDRESS,
    abi: SAVINGS_CONTRACT_ABI,
    functionName: 'getUserPlansCount',
    args: [],
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
            savingsType: Number(details[4]),
            balance: BigInt(details[0].toString()),
            target: BigInt(details[1].toString()),
            lockPeriod: BigInt(details[2].toString()),
            active: Boolean(details[5]),
          } as PlanDetails,
        }
      })
      .filter((plan): plan is NonNullable<typeof plan> => 
        plan !== null && 
        plan.details.savingsType === SavingsType.GOAL_BASED &&
        plan.details.active
      )

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

  // Filter plans based on lock period
  const filteredPlans = plans.filter(plan => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'short') return plan.details.lockPeriod <= BigInt(180 * 24 * 60 * 60)
    return plan.details.lockPeriod > BigInt(180 * 24 * 60 * 60)
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Savings Goals</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Set and track your financial goals with USDC savings.
        </p>
      </div>

      {!isConnected ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connect Wallet to Access Goals</h2>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Please use the connect button in the header to access your goals.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <ScrollArea className="w-full sm:w-auto">
              <div className="flex items-center gap-2 pb-2 sm:pb-0">
                <Button 
                  variant={activeFilter === 'all' ? 'outline' : 'ghost'} 
                  className="gap-1 whitespace-nowrap h-10 rounded-full"
                  onClick={() => setActiveFilter('all')}
                >
                  <Target className="h-4 w-4" />
                  All Goals
                </Button>
                <Button 
                  variant={activeFilter === 'short' ? 'outline' : 'ghost'} 
                  className="gap-1 whitespace-nowrap h-10 rounded-full"
                  onClick={() => setActiveFilter('short')}
                >
                  <BadgeDollarSign className="h-4 w-4" />
                  Short Term
                </Button>
                <Button 
                  variant={activeFilter === 'long' ? 'outline' : 'ghost'} 
                  className="gap-1 whitespace-nowrap h-10 rounded-full"
                  onClick={() => setActiveFilter('long')}
                >
                  <Home className="h-4 w-4" />
                  Long Term
                </Button>
              </div>
            </ScrollArea>
            <CreatePlanDialog onSuccess={loadPlans} defaultType={SavingsType.GOAL_BASED} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPlans.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardHeader className="p-6">
                <CardTitle className="text-xl text-center">No Goals Found</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 py-8">
                <div className="rounded-full bg-primary/10 p-6 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Create your first savings goal to start tracking your progress
                </p>
              </CardContent>
              <CardFooter className="justify-center p-6 pt-0">
                <CreatePlanDialog onSuccess={loadPlans} defaultType={SavingsType.GOAL_BASED}>
                  <Button className="h-10 rounded-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Goal
                  </Button>
                </CreatePlanDialog>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="card-hover overflow-hidden">
                  <div className="h-2 bg-primary w-full"></div>
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Goal #{plan.id}</CardTitle>
                      <div className="icon-container">
                        <Coins className="h-5 w-5" />
                      </div>
                    </div>
                    <CardDescription>
                      {Number(plan.details.lockPeriod) <= 180 * 24 * 60 * 60 ? "Short-term goal" : "Long-term goal"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-muted-foreground">Current</div>
                      <CurrencyDisplay amount={Number(plan.details.balance)} />
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-muted-foreground">Target</div>
                      <CurrencyDisplay amount={Number(plan.details.target)} />
                    </div>
                    <div className="progress-bar-container mb-2">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${(Number(plan.details.balance) / Number(plan.details.target)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Sparkles className="mr-1 h-3 w-3 text-primary" />
                        <span>
                          {Math.round((Number(plan.details.balance) / Number(plan.details.target)) * 100)}% complete
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-2 p-6 pt-0">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto h-10 rounded-full" asChild>
                      <Link href={`/goals/${plan.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" className="w-full sm:w-auto h-10 rounded-full">
                      Add Funds
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Card className="border-dashed border-2 card-hover">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl text-center">Create New Goal</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6 py-8">
                  <div className="rounded-full bg-primary/10 p-6 mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Set a new financial goal and track your progress with USDC savings
                  </p>
                </CardContent>
                <CardFooter className="justify-center p-6 pt-0">
                  <CreatePlanDialog onSuccess={loadPlans} defaultType={SavingsType.GOAL_BASED}>
                    <Button className="h-10 rounded-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Goal
                    </Button>
                  </CreatePlanDialog>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
