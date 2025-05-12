"use client"

import { useState, useEffect } from "react"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarClock, Plus, Target, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAccount, useContractRead } from 'wagmi'
import { SAVINGS_CONTRACT_ABI, SAVINGS_CONTRACT_ADDRESS, type PlanDetails, SavingsType } from "@/lib/contract"
import { Wallet as OnchainWallet } from '@coinbase/onchainkit/wallet'
import CreatePlanDialog from "@/components/create-plan-dialog"

export default function TimePage() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<{ id: number; details: PlanDetails }[]>([])

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
            savingsType: Number(details[4]), // savingsType is at index 4
            balance: BigInt(details[0].toString()), // balance is at index 0
            target: BigInt(details[1].toString()), // target is at index 1
            lockPeriod: BigInt(details[2].toString()), // lockPeriodEnd is at index 2
            active: Boolean(details[5]), // active is at index 5
          } as PlanDetails,
        }
      })
      .filter((plan): plan is NonNullable<typeof plan> => 
        plan !== null && 
        plan.details.savingsType === SavingsType.TIME_BASED &&
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

  // Calculate total time-based savings
  const totalTimeSavings = plans.reduce((acc, plan) => acc + Number(formatUnits(plan.details.balance, 6)), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Time-based Savings</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Lock your savings for a specific period to earn higher returns.
        </p>
      </div>

      {!isConnected ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <CalendarClock className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connect Wallet to View Time-based Savings</h2>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Connect your wallet to view and manage your time-based savings or create new ones.
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-1">
                <CalendarClock className="h-4 w-4" />
                All Time Plans
              </Button>
            </div>
            <CreatePlanDialog onSuccess={loadPlans} defaultType={SavingsType.TIME_BASED}>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Time-based Plan
              </Button>
            </CreatePlanDialog>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Time-based Savings</CardTitle>
                <CardDescription>Locked savings across all plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalTimeSavings.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {plans.length} active time-based plans
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Active Time-based Plans</CardTitle>
                <CardDescription>Your current time-based savings plans</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan ID</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Lock Period</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {plans.map((plan) => (
                          <TableRow key={plan.id}>
                            <TableCell>Time Plan #{plan.id}</TableCell>
                            <TableCell className="font-medium">
                              ${Number(formatUnits(plan.details.balance, 6)).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {Math.round(Number(plan.details.lockPeriod) / (24 * 60 * 60))} days
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                                Active
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="md:hidden space-y-4 p-4">
                    {plans.map((plan) => (
                      <div key={plan.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Time Plan #{plan.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(Number(plan.details.lockPeriod) / (24 * 60 * 60))} days lock
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${Number(formatUnits(plan.details.balance, 6)).toFixed(2)}
                          </div>
                          <div className="text-xs text-emerald-500">Active</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create a New Time-based Plan</CardTitle>
              <CardDescription>Lock your savings for higher returns</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-muted p-6 mb-4">
                <CalendarClock className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center max-w-md">
                <h3 className="text-lg font-medium mb-2">Time-based Savings Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left list-disc pl-4 mb-4">
                  <li>Lock your savings for a fixed period</li>
                  <li>Choose from various lock periods</li>
                  <li>Earn higher returns for longer lock periods</li>
                  <li>Perfect for medium to long-term savings goals</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <CreatePlanDialog onSuccess={loadPlans} defaultType={SavingsType.TIME_BASED}>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Start Time-based Plan
                </Button>
              </CreatePlanDialog>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
} 