"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, LogOut, Settings, Target, Timer, Wallet, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Sidebar() {
  const pathname = usePathname()

  const mainRoutes = [
    {
      href: "/",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/analytics",
      icon: BarChart3,
      title: "Analytics",
    },
  ]

  const savingsRoutes = [
    {
      href: "/savings",
      icon: Coins,
      title: "My Savings",
    },
    {
      href: "/time-based",
      icon: Timer,
      title: "Time Based",
    },
    {
      href: "/goals",
      icon: Target,
      title: "Goals",
    },
    {
      href: "/flexible",
      icon: Wallet,
      title: "Flexible",
    },
  ]

  const settingsRoutes = [
    {
      href: "/accounts",
      icon: CreditCard,
      title: "Accounts",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  const NavGroup = ({ routes, title }: { routes: typeof mainRoutes, title?: string }) => (
    <div className="space-y-2">
      {title && <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>}
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:bg-accent/50",
            pathname === route.href 
              ? "bg-accent text-accent-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.title}
        </Link>
      ))}
    </div>
  )

  return (
    <div className="hidden border-r bg-gradient-to-b from-background/80 to-background backdrop-blur-md md:block md:w-72">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">RiiFI</span>
          </Link>
        </div>
        
        <div className="flex-1 space-y-4 overflow-auto py-6">
          <NavGroup routes={mainRoutes} />
          <Separator className="mx-4" />
          <NavGroup routes={savingsRoutes} title="Savings" />
          <Separator className="mx-4" />
          <NavGroup routes={settingsRoutes} title="Settings" />
        </div>

        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
