"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users, Mail, Search, Megaphone, TrendingUp, ArrowUpRight,
  Plus, MessageSquare, Download, Eye
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    { label: "Total Leads", value: "12,847", change: "+12.5%", icon: Users, color: "text-blue-400" },
    { label: "Verified Emails", value: "9,234", change: "+8.2%", icon: Mail, color: "text-emerald-400" },
    { label: "Searches Today", value: "156", change: "+23.1%", icon: Search, color: "text-purple-400" },
    { label: "Active Campaigns", value: "8", change: "+2", icon: Megaphone, color: "text-orange-400" },
  ]

  const recentActivity = [
    { action: "New lead found", detail: "Sarah Chen — CloudSync", time: "2 min ago", type: "lead" },
    { action: "Email verified", detail: "james@techcorp.io — Valid", time: "5 min ago", type: "verify" },
    { action: "Research completed", detail: "Tesla Inc. — Full profile", time: "12 min ago", type: "research" },
    { action: "Campaign sent", detail: "Q4 Outreach — 45 emails", time: "1 hour ago", type: "campaign" },
    { action: "Export completed", detail: "1,234 leads to CSV", time: "2 hours ago", type: "export" },
    { action: "New lead found", detail: "Mike Johnson — DataVault", time: "3 hours ago", type: "lead" },
  ]

  const topSources = [
    { name: "LinkedIn", leads: 4523, percentage: 35 },
    { name: "Web Search", leads: 3211, percentage: 25 },
    { name: "Crunchbase", leads: 1934, percentage: 15 },
    { name: "GitHub", leads: 1289, percentage: 10 },
    { name: "Google Maps", leads: 967, percentage: 7.5 },
    { name: "Other", leads: 923, percentage: 7.5 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Welcome back! Here&apos;s your lead generation overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/chat">
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
              <MessageSquare className="w-4 h-4 mr-2" /> AI Chat
            </Button>
          </Link>
          <Link href="/dashboard/leads">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Add Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">{stat.change}</span>
                <span className="text-xs text-zinc-500">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-[#0a0a0a] border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "lead" ? "bg-blue-500/20" :
                    activity.type === "verify" ? "bg-emerald-500/20" :
                    activity.type === "research" ? "bg-purple-500/20" :
                    activity.type === "campaign" ? "bg-orange-500/20" :
                    "bg-zinc-500/20"
                  }`}>
                    {activity.type === "lead" ? <Users className="w-4 h-4 text-blue-400" /> :
                     activity.type === "verify" ? <Mail className="w-4 h-4 text-emerald-400" /> :
                     activity.type === "research" ? <Eye className="w-4 h-4 text-purple-400" /> :
                     activity.type === "campaign" ? <Megaphone className="w-4 h-4 text-orange-400" /> :
                     <Download className="w-4 h-4 text-zinc-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-zinc-400 truncate">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-zinc-500 flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSources.map((source) => (
                <div key={source.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{source.name}</span>
                    <span className="text-zinc-400">{source.leads.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/chat">
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                <MessageSquare className="w-4 h-4 mr-2" /> AI Search
              </Button>
            </Link>
            <Link href="/dashboard/verify">
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                <Mail className="w-4 h-4 mr-2" /> Verify Email
              </Button>
            </Link>
            <Link href="/dashboard/research">
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                <Search className="w-4 h-4 mr-2" /> Research Co.
              </Button>
            </Link>
            <Link href="/dashboard/export">
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Usage Chart Placeholder */}
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Usage Over Time</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-white/10 text-zinc-400">7 days</Badge>
              <Badge variant="outline" className="border-white/10 text-zinc-400">30 days</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-0">90 days</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end gap-2">
            {[35, 45, 30, 60, 75, 55, 80, 65, 90, 70, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-blue-500 to-emerald-500 opacity-80 hover:opacity-100 transition"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-zinc-600">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
