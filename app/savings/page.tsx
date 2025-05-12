"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Plus, Loader2, Wallet, Target, Clock, TrendingUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import CreatePlanDialog from "@/components/create-plan-dialog"
import PlanCard from "@/components/plan-card"
import { SAVINGS_CONTRACT_ABI, SAVINGS_CONTRACT_ADDRESS, type PlanDetails, SavingsType } from "@/lib/contract"
import { ConnectAndSIWE } from "@/components/connect-and-siwe"
import { motion } from "framer-motion"

// Mockup data for development
const MOCKUP_PLANS = [
  {
    id: 0,
    details: {
      savingsType: SavingsType.FLEXIBLE,
      balance: BigInt(5000000), // $5,000 (6 decimals for USDC)
      target: BigInt(0),
      lockPeriod: BigInt(0),
      active: true,
    } as PlanDetails,
  },
  {
    id: 1,
    details: {
      savingsType: SavingsType.GOAL_BASED,
      balance: BigInt(2500000), // $2,500
      target: BigInt(10000000), // $10,000
      lockPeriod: BigInt(0),
      active: true,
    } as PlanDetails,
  },
  {
    id: 2,
    details: {
      savingsType: SavingsType.TIME_BASED,
      balance: BigInt(7500000), // $7,500
      target: BigInt(0),
      lockPeriod: BigInt(180 * 24 * 60 * 60), // 180 days
      active: true,
    } as PlanDetails,
  },
  {
    id: 3,
    details: {
      savingsType: SavingsType.GOAL_BASED,
      balance: BigInt(15000000), // $15,000
      target: BigInt(20000000), // $20,000
      lockPeriod: BigInt(0),
      active: true,
    } as PlanDetails,
  },
  {
    id: 4,
    details: {
      savingsType: SavingsType.TIME_BASED,
      balance: BigInt(3000000), // $3,000
      target: BigInt(0),
      lockPeriod: BigInt(365 * 24 * 60 * 60), // 1 year
      active: true,
    } as PlanDetails,
  },
];

export default function SavingsPage() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<{ id: number; details: PlanDetails }[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [useMockData, setUseMockData] = useState(true) // Toggle for mockup data

  // Get user's plans count with real-time updates
  const { data: plansCount, refetch: refetchPlansCount } = useContractRead({
    address: SAVINGS_CONTRACT_ADDRESS,
    abi: SAVINGS_CONTRACT_ABI,
    functionName: 'getUserPlansCount',
    args: [],
    query: {
      enabled: isConnected && !!address && !useMockData,
      refetchInterval: 5000,
    },
  })

  // Load user's plans with real-time updates
  useEffect(() => {
    const loadPlans = async () => {
      if (useMockData) {
        setPlans(MOCKUP_PLANS);
        return;
      }

      if (!isConnected || !plansCount || !address) return

      setLoading(true)
      try {
        const planIds = Array.from({ length: Number(plansCount) }, (_, i) => i)
        
        const contractReads = planIds.map(id => ({
          address: SAVINGS_CONTRACT_ADDRESS,
          abi: SAVINGS_CONTRACT_ABI,
          functionName: 'getPlanDetails',
          args: [BigInt(id)],
        }))

        const { data: planDetailsArray } = await useContractReads({
          contracts: contractReads,
          query: {
            enabled: isConnected && !!address,
            refetchInterval: 5000,
          }
        })

        const plansData = (planDetailsArray || []).map((details, id) => {
          if (!details?.result) return null
          const result = details.result as any
          return {
            id,
            details: {
              savingsType: Number(result[4]),
              balance: BigInt(result[0].toString()),
              target: BigInt(result[1].toString()),
              lockPeriod: BigInt(result[2].toString()),
              active: Boolean(result[5]),
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

    loadPlans()

    if (!useMockData) {
      const interval = setInterval(() => {
        loadPlans()
        refetchPlansCount()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isConnected, address, plansCount, useMockData])

  // Filter plans based on active tab
  const filteredPlans = plans.filter((plan) => {
    if (activeTab === "all") return true
    if (activeTab === "flexible") return plan.details.savingsType === SavingsType.FLEXIBLE
    if (activeTab === "goal") return plan.details.savingsType === SavingsType.GOAL_BASED
    if (activeTab === "time") return plan.details.savingsType === SavingsType.TIME_BASED
    return true
  })

  const handlePlanUpdate = () => {
    if (!useMockData) {
      refetchPlansCount()
    }
  }

  // Toggle mockup data button for development
  const toggleMockData = () => {
    setUseMockData(prev => !prev)
    setPlans(useMockData ? [] : MOCKUP_PLANS)
  }

  // Calculate total savings across all plans
  const totalSavings = plans.reduce((sum, plan) => sum + Number(plan.details.balance), 0) / 1000000 // Convert from USDC 6 decimals

  // Count plans by type
  const planCounts = {
    flexible: plans.filter(p => p.details.savingsType === SavingsType.FLEXIBLE).length,
    goal: plans.filter(p => p.details.savingsType === SavingsType.GOAL_BASED).length,
    time: plans.filter(p => p.details.savingsType === SavingsType.TIME_BASED).length,
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Savings
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Manage all your USDC savings plans in one place.
            </p>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMockData}
              className="h-8 rounded-full text-xs"
            >
              {useMockData ? 'Use Real Data' : 'Use Mock Data'}
            </Button>
          )}
        </div>

        {(isConnected || useMockData) && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Savings</p>
                    <h3 className="text-2xl font-bold">${totalSavings.toLocaleString()}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Flexible Plans</p>
                    <h3 className="text-2xl font-bold">{planCounts.flexible}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Goal Plans</p>
                    <h3 className="text-2xl font-bold">{planCounts.goal}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-500/10 p-3">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Plans</p>
                    <h3 className="text-2xl font-bold">{planCounts.time}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {!isConnected && !useMockData ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="rounded-full bg-primary/10 p-6 mb-6">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Connect Wallet to View Your Plans</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-md">
                Connect your wallet to view and manage your existing savings plans or create new ones.
              </p>
              <ConnectAndSIWE />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 py-4">
              <ScrollArea className="w-full sm:w-auto">
                <TabsList className="h-10 p-1 rounded-full bg-muted/50">
                  <TabsTrigger value="all" className="text-xs sm:text-sm rounded-full">
                    All Plans
                  </TabsTrigger>
                  <TabsTrigger value="flexible" className="text-xs sm:text-sm rounded-full">
                    Flexible
                  </TabsTrigger>
                  <TabsTrigger value="goal" className="text-xs sm:text-sm rounded-full">
                    Goal Based
                  </TabsTrigger>
                  <TabsTrigger value="time" className="text-xs sm:text-sm rounded-full">
                    Time Based
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex h-10 rounded-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <CreatePlanDialog onSuccess={handlePlanUpdate} />
              </div>
            </div>

            <TabsContent value="all" className="mt-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPlans.length === 0 ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-primary/10 to-transparent">
                      <div className="rounded-full bg-primary/10 p-6 mb-6">
                        <Plus className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-3">No Savings Plans Yet</h2>
                      <p className="text-center text-muted-foreground mb-8 max-w-md">
                        You don't have any savings plans yet. Create your first plan to start saving!
                      </p>
                      <CreatePlanDialog onSuccess={handlePlanUpdate} />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <motion.div 
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <PlanCard
                        planId={plan.id}
                        planDetails={plan.details}
                        onUpdateAction={handlePlanUpdate}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="flexible" className="mt-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPlans.length === 0 ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-primary/10 to-transparent">
                      <div className="rounded-full bg-primary/10 p-6 mb-6">
                        <Plus className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-3">No Flexible Plans</h2>
                      <p className="text-center text-muted-foreground mb-8 max-w-md">
                        You don't have any flexible savings plans. Create one to start saving with no lock period!
                      </p>
                      <CreatePlanDialog onSuccess={handlePlanUpdate} />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <motion.div 
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <PlanCard
                        planId={plan.id}
                        planDetails={plan.details}
                        onUpdateAction={handlePlanUpdate}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="goal" className="mt-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPlans.length === 0 ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-primary/10 to-transparent">
                      <div className="rounded-full bg-primary/10 p-6 mb-6">
                        <Plus className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-3">No Goal-Based Plans</h2>
                      <p className="text-center text-muted-foreground mb-8 max-w-md">
                        You don't have any goal-based savings plans. Create one to start saving towards a specific target!
                      </p>
                      <CreatePlanDialog onSuccess={handlePlanUpdate} />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <motion.div 
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <PlanCard
                        planId={plan.id}
                        planDetails={plan.details}
                        onUpdateAction={handlePlanUpdate}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="time" className="mt-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPlans.length === 0 ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-primary/10 to-transparent">
                      <div className="rounded-full bg-primary/10 p-6 mb-6">
                        <Plus className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-3">No Time-Based Plans</h2>
                      <p className="text-center text-muted-foreground mb-8 max-w-md">
                        You don't have any time-based savings plans. Create one to start saving with a lock period!
                      </p>
                      <CreatePlanDialog onSuccess={handlePlanUpdate} />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <motion.div 
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <PlanCard
                        planId={plan.id}
                        planDetails={plan.details}
                        onUpdateAction={handlePlanUpdate}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
