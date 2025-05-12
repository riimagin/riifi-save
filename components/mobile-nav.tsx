"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Target, Wallet, Coins } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MobileNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: Home,
      title: "Home",
    },
    {
      href: "/savings",
      icon: Coins,
      title: "Savings",
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
    {
      href: "/analytics",
      icon: BarChart3,
      title: "Analytics",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/80 backdrop-blur-md border-t md:hidden">
      <div className="grid h-full grid-cols-5">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium text-muted-foreground",
              pathname === route.href && "text-foreground",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full p-2 mb-1",
                pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
            </div>
            <span>{route.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
