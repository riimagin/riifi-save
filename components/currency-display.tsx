"use client"

import { cn } from "@/lib/utils"
import { Coins } from "lucide-react"

interface CurrencyDisplayProps {
  amount: number
  className?: string
  showSymbol?: boolean
  symbolClassName?: string
  compact?: boolean
  iconSize?: number
}

export function CurrencyDisplay({
  amount,
  className,
  showSymbol = true,
  symbolClassName,
  compact = false,
  iconSize = 14,
}: CurrencyDisplayProps) {
  const formattedAmount = compact
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)
    : new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showSymbol && (
        <div className={cn("flex items-center text-primary", symbolClassName)}>
          <Coins className={cn(`h-${iconSize / 4} w-${iconSize / 4} mr-1`)} />
          <span className="font-medium">USDC</span>
        </div>
      )}
      <span>{formattedAmount}</span>
    </div>
  )
}

export function formatCurrency(amount: number, compact = false): string {
  return compact
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)
    : new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}
