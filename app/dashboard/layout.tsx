"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, Megaphone, Building2, Search,
  Mail, Download, Settings, MessageSquare, ChevronLeft, Menu,
  Kanban, Radio, GitBranch, BarChart3, Shield, TrendingUp
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/leads", icon: Users, label: "Leads" },
  { href: "/dashboard/pipeline", icon: Kanban, label: "Pipeline" },
  { href: "/dashboard/campaigns", icon: Megaphone, label: "Campaigns" },
  { href: "/dashboard/sequences", icon: GitBranch, label: "Sequences" },
  { href: "/dashboard/research", icon: Building2, label: "Research" },
  { href: "/dashboard/finder", icon: Search, label: "Finder" },
  { href: "/dashboard/verify", icon: Mail, label: "Verify" },
  { href: "/dashboard/signals", icon: Radio, label: "Signals" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/export", icon: Download, label: "Export" },
  { href: "/dashboard/compliance", icon: Shield, label: "Compliance" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col border-r border-white/10 bg-[#050505] transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}>
        {/* Logo */}
        <div className="h-14 border-b border-white/10 flex items-center px-4 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
            K
          </div>
          {!collapsed && <span className="font-bold text-lg">KeeLead</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-zinc-400 hover:text-white transition"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Chat Link */}
        <div className="p-2 border-t border-white/10">
          <Link
            href="/chat"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition"
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>AI Chat</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
