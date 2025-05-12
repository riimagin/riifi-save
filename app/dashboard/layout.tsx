import { type ReactNode } from 'react';
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import MobileNav from "@/components/mobile-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0 gradient-bg">
          <div className="container mx-auto px-3 py-3 md:px-4 md:py-6 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
} 