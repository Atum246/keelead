"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  BarChart3, TrendingUp, TrendingDown, Users, Mail, Eye,
  MousePointerClick, Reply, ArrowUpRight, ArrowDownRight,
  Globe, Search, Building2, Github, MapPin, Calendar,
  Download, Filter, RefreshCw
} from "lucide-react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")

  const overviewStats = [
    { label: "Total Leads", value: "12,847", change: "+12.5%", up: true, icon: <Users className="w-4 h-4 text-blue-400" /> },
    { label: "Emails Sent", value: "8,432", change: "+23.1%", up: true, icon: <Mail className="w-4 h-4 text-purple-400" /> },
    { label: "Open Rate", value: "47.3%", change: "+5.2%", up: true, icon: <Eye className="w-4 h-4 text-emerald-400" /> },
    { label: "Reply Rate", value: "14.8%", change: "-1.3%", up: false, icon: <Reply className="w-4 h-4 text-orange-400" /> },
    { label: "Click Rate", value: "8.2%", change: "+2.1%", up: true, icon: <MousePointerClick className="w-4 h-4 text-yellow-400" /> },
    { label: "Conversion", value: "3.4%", change: "+0.8%", up: true, icon: <TrendingUp className="w-4 h-4 text-green-400" /> },
  ]

  const sourcePerformance = [
    { source: "LinkedIn", leads: 4523, emails: 2345, opens: 1234, replies: 234, convRate: 5.2, icon: <Users className="w-4 h-4" /> },
    { source: "Web Search", leads: 3211, emails: 1890, opens: 945, replies: 156, convRate: 3.8, icon: <Globe className="w-4 h-4" /> },
    { source: "Crunchbase", leads: 1934, emails: 1200, opens: 672, replies: 134, convRate: 4.5, icon: <Building2 className="w-4 h-4" /> },
    { source: "GitHub", leads: 1289, emails: 800, opens: 360, replies: 72, convRate: 2.9, icon: <Github className="w-4 h-4" /> },
    { source: "Google Maps", leads: 967, emails: 600, opens: 318, replies: 48, convRate: 3.1, icon: <MapPin className="w-4 h-4" /> },
    { source: "Hunter.io", leads: 623, emails: 400, opens: 204, replies: 38, convRate: 4.1, icon: <Search className="w-4 h-4" /> },
  ]

  const funnelStages = [
    { stage: "Total Leads", count: 12847, percentage: 100, color: "bg-blue-500" },
    { stage: "Contacted", count: 8432, percentage: 65.6, color: "bg-purple-500" },
    { stage: "Opened", count: 3989, percentage: 31.0, color: "bg-yellow-500" },
    { stage: "Clicked", count: 1056, percentage: 8.2, color: "bg-orange-500" },
    { stage: "Replied", count: 1248, percentage: 9.7, color: "bg-emerald-500" },
    { stage: "Qualified", count: 514, percentage: 4.0, color: "bg-green-500" },
    { stage: "Converted", count: 437, percentage: 3.4, color: "bg-emerald-400" },
  ]

  const weeklyData = [
    { week: "W1", leads: 320, emails: 210, opens: 98, replies: 21 },
    { week: "W2", leads: 410, emails: 280, opens: 134, replies: 28 },
    { week: "W3", leads: 380, emails: 310, opens: 156, replies: 35 },
    { week: "W4", leads: 520, emails: 390, opens: 189, replies: 42 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">Campaign performance, source breakdown, and conversion funnels.</p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                dateRange === range ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {range}
            </button>
          ))}
          <Button variant="outline" size="sm" className="border-white/10 ml-2">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">{stat.icon} {stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs ${stat.up ? "text-emerald-400" : "text-red-400"}`}>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Performance */}
        <Card className="lg:col-span-2 bg-[#0a0a0a] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Source Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-2 text-zinc-400 font-medium text-xs">Source</th>
                    <th className="text-right p-2 text-zinc-400 font-medium text-xs">Leads</th>
                    <th className="text-right p-2 text-zinc-400 font-medium text-xs">Sent</th>
                    <th className="text-right p-2 text-zinc-400 font-medium text-xs">Opens</th>
                    <th className="text-right p-2 text-zinc-400 font-medium text-xs">Replies</th>
                    <th className="text-right p-2 text-zinc-400 font-medium text-xs">Conv %</th>
                  </tr>
                </thead>
                <tbody>
                  {sourcePerformance.map((source) => (
                    <tr key={source.source} className="border-b border-white/5">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                          {source.icon}
                        </div>
                        {source.source}
                      </td>
                      <td className="p-2 text-right">{source.leads.toLocaleString()}</td>
                      <td className="p-2 text-right text-zinc-400">{source.emails.toLocaleString()}</td>
                      <td className="p-2 text-right text-emerald-400">{source.opens.toLocaleString()}</td>
                      <td className="p-2 text-right text-blue-400">{source.replies}</td>
                      <td className="p-2 text-right">
                        <Badge className={`border-0 text-xs ${source.convRate >= 4 ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-500/20 text-zinc-400"}`}>
                          {source.convRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funnelStages.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">{stage.stage}</span>
                    <span className="font-medium">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="h-6 bg-white/5 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${stage.color} opacity-80 rounded-lg flex items-center justify-end pr-2`}
                      style={{ width: `${stage.percentage}%` }}
                    >
                      <span className="text-[10px] font-bold">{stage.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end gap-8 px-4">
            {weeklyData.map((week) => (
              <div key={week.week} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end" style={{ height: "140px" }}>
                  <div className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(week.leads / 520) * 100}%` }} />
                  <div className="flex-1 bg-purple-500 rounded-t" style={{ height: `${(week.emails / 520) * 100}%` }} />
                  <div className="flex-1 bg-emerald-500 rounded-t" style={{ height: `${(week.opens / 520) * 100}%` }} />
                  <div className="flex-1 bg-orange-500 rounded-t" style={{ height: `${(week.replies / 520) * 100}%` }} />
                </div>
                <span className="text-xs text-zinc-400">{week.week}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded bg-blue-500" /> Leads
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded bg-purple-500" /> Sent
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded bg-emerald-500" /> Opens
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded bg-orange-500" /> Replies
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
