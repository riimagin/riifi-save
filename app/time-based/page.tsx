import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, GraduationCap, Home, Plus, Umbrella } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TimeBasedPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Time-Based Savings</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Savings plans with fixed time periods and regular contributions.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ScrollArea className="w-full sm:w-auto">
          <div className="flex items-center gap-2 pb-2 sm:pb-0">
            <Button variant="outline" className="gap-1 whitespace-nowrap">
              <Clock className="h-4 w-4" />
              All Plans
            </Button>
            <Button variant="ghost" className="gap-1 whitespace-nowrap">
              <Calendar className="h-4 w-4" />
              Short Term
            </Button>
            <Button variant="ghost" className="gap-1 whitespace-nowrap">
              <Home className="h-4 w-4" />
              Long Term
            </Button>
          </div>
        </ScrollArea>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Retirement</CardTitle>
              <Umbrella className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>5-year term deposit</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Current Balance</div>
              <div className="text-sm font-medium">$4,800.00</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Interest Rate</div>
              <div className="text-sm font-medium">3.5%</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-sm text-muted-foreground">Maturity Date</div>
              <div className="text-sm font-medium">May 15, 2028</div>
            </div>
            <Progress value={40} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>40% of term completed</div>
              <div>Monthly deposit: $200</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
              <Link href="/time-based/retirement">View Details</Link>
            </Button>
            <Button size="sm" className="w-full sm:w-auto">
              Add Funds
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Education</CardTitle>
              <GraduationCap className="h-5 w-5 text-emerald-500" />
            </div>
            <CardDescription>3-year savings plan</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Current Balance</div>
              <div className="text-sm font-medium">$2,300.00</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">Interest Rate</div>
              <div className="text-sm font-medium">2.8%</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-sm text-muted-foreground">Maturity Date</div>
              <div className="text-sm font-medium">Jan 10, 2026</div>
            </div>
            <Progress value={25} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>25% of term completed</div>
              <div>Monthly deposit: $150</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
              <Link href="/time-based/education">View Details</Link>
            </Button>
            <Button size="sm" className="w-full sm:w-auto">
              Add Funds
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-dashed border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-center">Create New Plan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Start a new time-based savings plan with regular contributions
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Time-Based Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
