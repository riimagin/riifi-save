"use client"

import { useState, useEffect } from "react"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Download, Plus, Upload, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAccount, useContractRead } from 'wagmi'
import { SAVINGS_CONTRACT_ABI, SAVINGS_CONTRACT_ADDRESS, type PlanDetails, SavingsType } from "@/lib/contract"
import { Wallet as OnchainWallet } from '@coinbase/onchainkit/wallet'
import CreatePlanDialog from "@/components/create-plan-dialog"

export default function FlexiblePage() {
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
      })
      .filter((plan): plan is NonNullable<typeof plan> => 
        plan !== null && 
        plan.details.savingsType === SavingsType.FLEXIBLE &&
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Flexible Savings</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Savings with no fixed term or target that you can access anytime.
        </p>
      </div>

      {!isConnected ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connect Wallet to View Flexible Savings</h2>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Connect your wallet to view and manage your flexible savings or create new ones.
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
                <Wallet className="h-4 w-4" />
                All Accounts
              </Button>
            </div>
            <CreatePlanDialog onSuccess={loadPlans} defaultType={SavingsType.FLEXIBLE}>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Flexible Account
              </Button>
            </CreatePlanDialog>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Flexible Balance</CardTitle>
                <CardDescription>Available for withdrawal anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${flexibleBalance ? Number(formatUnits(flexibleBalance, 6)).toFixed(2) : "0.00"}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  No lock period or withdrawal restrictions
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent deposits and withdrawals</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {plans.map((plan) => (
                          <TableRow key={plan.id}>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                            <TableCell>Flexible Plan #{plan.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Upload className="mr-2 h-4 w-4 text-emerald-500" />
                                Active Plan
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-emerald-600">
                              ${Number(formatUnits(plan.details.balance, 6)).toFixed(2)}
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
                          <div className="font-medium">Flexible Plan #{plan.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-emerald-600">
                            ${Number(formatUnits(plan.details.balance, 6)).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">Active Plan</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/flexible/transactions">View All Transactions</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create a New Flexible Savings Account</CardTitle>
              <CardDescription>Start saving with no restrictions on deposits or withdrawals</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center max-w-md">
                <h3 className="text-lg font-medium mb-2">Flexible Savings Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left list-disc pl-4 mb-4">
                  <li>No minimum balance requirements</li>
                  <li>Withdraw funds anytime without penalties</li>
                  <li>No fixed term commitments</li>
                  <li>Perfect for emergency funds or short-term savings</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <CreatePlanDialog onSuccess={loadPlans} defaultType={SavingsType.FLEXIBLE}>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Open New Flexible Account
                </Button>
              </CreatePlanDialog>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
