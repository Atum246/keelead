"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Zap, TrendingUp, UserPlus, Newspaper, Briefcase, Bell,
  Search, Filter, ArrowUpRight, Clock, Building2, Users,
  Globe, AlertCircle, CheckCircle2, Loader2, Plus, Settings
} from "lucide-react"

interface Signal {
  id: string
  type: "job_change" | "news" | "hiring" | "social" | "funding" | "product"
  title: string
  description: string
  company: string
  person?: string
  date: string
  score: number
  source: string
  actionable: boolean
}

const demoSignals: Signal[] = [
  { id: "1", type: "job_change", title: "New CTO at CloudSync", description: "Alex Rivera joined as CTO, previously at Google Cloud", company: "CloudSync", person: "Alex Rivera", date: "2 hours ago", score: 92, source: "LinkedIn", actionable: true },
  { id: "2", type: "hiring", title: "DataVault hiring 15 engineers", description: "Aggressive engineering expansion — likely building new product", company: "DataVault", date: "5 hours ago", score: 85, source: "Job Boards", actionable: true },
  { id: "3", type: "funding", title: "Nexus AI raises $30M Series B", description: "Led by Sequoia Capital, will expand sales team", company: "Nexus AI", date: "1 day ago", score: 95, source: "Crunchbase", actionable: true },
  { id: "4", type: "news", title: "TechCorp launches new product line", description: "Announced enterprise suite at TechCrunch Disrupt", company: "TechCorp", date: "1 day ago", score: 78, source: "TechCrunch", actionable: false },
  { id: "5", type: "social", title: "CEO of InnovateLab trending on Twitter", description: "Thread about AI in healthcare got 5K retweets", company: "InnovateLab", person: "Sarah Kim", date: "3 days ago", score: 72, source: "Twitter/X", actionable: false },
  { id: "6", type: "product", title: "Vertex Inc releases API v3", description: "Major platform update with new integration capabilities", company: "Vertex Inc", date: "4 days ago", score: 68, source: "Product Hunt", actionable: true },
  { id: "7", type: "job_change", title: "VP Sales moves to Apex Digital", description: "Michael Chen left Salesforce to join Apex Digital", company: "Apex Digital", person: "Michael Chen", date: "5 days ago", score: 88, source: "LinkedIn", actionable: true },
  { id: "8", type: "hiring", title: "Horizon Tech hiring 50+ roles", description: "Massive hiring across engineering, sales, and marketing", company: "Horizon Tech", date: "1 week ago", score: 82, source: "Indeed", actionable: true },
]

export default function SignalsPage() {
  const [signals] = useState<Signal[]>(demoSignals)
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = signals.filter((s) => {
    const matchesType = typeFilter === "all" || s.type === typeFilter
    const matchesSearch = `${s.title} ${s.company} ${s.description}`.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const typeIcons: Record<string, React.ReactNode> = {
    job_change: <UserPlus className="w-4 h-4" />,
    news: <Newspaper className="w-4 h-4" />,
    hiring: <Briefcase className="w-4 h-4" />,
    social: <Globe className="w-4 h-4" />,
    funding: <TrendingUp className="w-4 h-4" />,
    product: <Zap className="w-4 h-4" />,
  }

  const typeColors: Record<string, string> = {
    job_change: "bg-blue-500/20 text-blue-400",
    news: "bg-yellow-500/20 text-yellow-400",
    hiring: "bg-emerald-500/20 text-emerald-400",
    social: "bg-purple-500/20 text-purple-400",
    funding: "bg-green-500/20 text-green-400",
    product: "bg-orange-500/20 text-orange-400",
  }

  const signalCounts = {
    all: signals.length,
    job_change: signals.filter((s) => s.type === "job_change").length,
    hiring: signals.filter((s) => s.type === "hiring").length,
    funding: signals.filter((s) => s.type === "funding").length,
    news: signals.filter((s) => s.type === "news").length,
    social: signals.filter((s) => s.type === "social").length,
    product: signals.filter((s) => s.type === "product").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Intent Signals</h1>
          <p className="text-zinc-400 text-sm mt-1">Track job changes, news, hiring signals, and social mentions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10">
            <Bell className="w-4 h-4 mr-2" /> Alerts
          </Button>
          <Button variant="outline" size="sm" className="border-white/10">
            <Settings className="w-4 h-4 mr-2" /> Configure
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Zap className="w-4 h-4 text-yellow-400" /> Total Signals
            </div>
            <div className="text-2xl font-bold">{signals.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Actionable
            </div>
            <div className="text-2xl font-bold text-emerald-400">{signals.filter((s) => s.actionable).length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Avg Score
            </div>
            <div className="text-2xl font-bold text-blue-400">{Math.round(signals.reduce((a, s) => a + s.score, 0) / signals.length)}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Clock className="w-4 h-4 text-purple-400" /> Today
            </div>
            <div className="text-2xl font-bold">{signals.filter((s) => s.date.includes("hour") || s.date.includes("min")).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(signalCounts).map(([type, count]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              typeFilter === type ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {type === "all" ? "All" : typeIcons[type]}
            {type === "all" ? "All" : type.replace("_", " ")} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search signals..."
          className="pl-9 bg-white/5 border-white/10"
        />
      </div>

      {/* Signals List */}
      <div className="space-y-3">
        {filtered.map((signal) => (
          <Card key={signal.id} className="bg-[#0a0a0a] border-white/10 hover:border-white/20 transition">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[signal.type]}`}>
                  {typeIcons[signal.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{signal.title}</h3>
                    <Badge className={`${typeColors[signal.type]} border-0 text-xs`}>
                      {signal.type.replace("_", " ")}
                    </Badge>
                    {signal.actionable && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                        Actionable
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">{signal.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {signal.company}
                    </span>
                    {signal.person && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {signal.person}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {signal.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {signal.date}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-lg font-bold ${
                    signal.score >= 90 ? "text-emerald-400" :
                    signal.score >= 75 ? "text-blue-400" :
                    "text-yellow-400"
                  }`}>{signal.score}</div>
                  <span className="text-xs text-zinc-500">Signal Score</span>
                  {signal.actionable && (
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-xs">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
