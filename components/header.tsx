"use client"

import { Coins } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { CustomConnectButton } from "@/components/connect-button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Coins className="h-6 w-6 text-primary" />
            <span>RiiFI</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="min-w-[200px]">
            <CustomConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
