import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, CreditCard, Download, ExternalLink, Link2, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AccountsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Linked Accounts</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your linked bank accounts and cards.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Chase Bank</CardTitle>
              <Building className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Checking Account</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Account Number</div>
              <div className="text-sm font-medium">****6789</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-sm font-medium flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                Active
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-sm font-medium">May 10, 2023</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto gap-1">
              <Link2 className="h-4 w-4" />
              Manage
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bank of America</CardTitle>
              <Building className="h-5 w-5 text-red-500" />
            </div>
            <CardDescription>Savings Account</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Account Number</div>
              <div className="text-sm font-medium">****4321</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-sm font-medium flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                Active
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-sm font-medium">May 8, 2023</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto gap-1">
              <Link2 className="h-4 w-4" />
              Manage
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Visa Credit Card</CardTitle>
              <CreditCard className="h-5 w-5 text-purple-500" />
            </div>
            <CardDescription>Credit Card</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Card Number</div>
              <div className="text-sm font-medium">****5678</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-sm font-medium flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                Active
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">Expires</div>
              <div className="text-sm font-medium">05/2025</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto gap-1">
              <Link2 className="h-4 w-4" />
              Manage
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-dashed border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-center">Link New Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Connect a bank account or card to make deposits and withdrawals
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Link Account
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Recent transactions from your linked accounts</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>May 10, 2023</TableCell>
                    <TableCell>Transfer to Savings</TableCell>
                    <TableCell>Chase Bank</TableCell>
                    <TableCell>Transfer</TableCell>
                    <TableCell className="text-right font-medium text-red-600">-$500.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>May 8, 2023</TableCell>
                    <TableCell>Deposit from Payroll</TableCell>
                    <TableCell>Bank of America</TableCell>
                    <TableCell>Deposit</TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">+$2,450.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>May 5, 2023</TableCell>
                    <TableCell>Grocery Store</TableCell>
                    <TableCell>Visa Credit Card</TableCell>
                    <TableCell>Purchase</TableCell>
                    <TableCell className="text-right font-medium text-red-600">-$85.75</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>May 3, 2023</TableCell>
                    <TableCell>Online Shopping</TableCell>
                    <TableCell>Visa Credit Card</TableCell>
                    <TableCell>Purchase</TableCell>
                    <TableCell className="text-right font-medium text-red-600">-$124.99</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>May 1, 2023</TableCell>
                    <TableCell>Credit Card Payment</TableCell>
                    <TableCell>Chase Bank</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell className="text-right font-medium text-red-600">-$350.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Mobile view */}
            <div className="grid gap-4 p-4 md:hidden">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">May 10, 2023</div>
                  <div className="text-right font-medium text-red-600">-$500.00</div>
                </div>
                <div className="text-sm mb-1">Transfer to Savings</div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>Chase Bank</div>
                  <div>Transfer</div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">May 8, 2023</div>
                  <div className="text-right font-medium text-emerald-600">+$2,450.00</div>
                </div>
                <div className="text-sm mb-1">Deposit from Payroll</div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>Bank of America</div>
                  <div>Deposit</div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">May 5, 2023</div>
                  <div className="text-right font-medium text-red-600">-$85.75</div>
                </div>
                <div className="text-sm mb-1">Grocery Store</div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>Visa Credit Card</div>
                  <div>Purchase</div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="gap-1 w-full sm:w-auto" asChild>
            <Link href="/accounts/transactions">
              View All Transactions
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
