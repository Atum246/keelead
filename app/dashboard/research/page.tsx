"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Search, Building2, Globe, Users, DollarSign, Newspaper,
  Cpu, TrendingUp, ExternalLink, Loader2, ChevronRight,
  MapPin, Calendar, Linkedin, Twitter, Github, Briefcase,
  Shield, Award, Target, BarChart3
} from "lucide-react"

interface CompanyProfile {
  name: string
  domain: string
  description: string
  industry: string
  size: string
  founded: string
  headquarters: string
  revenue: string
  techStack: string[]
  keyPeople: { name: string; title: string; email?: string }[]
  funding: { round: string; amount: string; date: string; investors: string[] }[]
  competitors: string[]
  news: { title: string; date: string; source: string; sentiment: string }[]
}

export default function ResearchPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompanyProfile | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Research</h1>
        <p className="text-zinc-400 text-sm mt-1">Deep dive into any company — overview, tech stack, people, funding, and more.</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter company name or domain (e.g., Tesla, Stripe, notion.so)"
            className="pl-9 bg-white/5 border-white/10 h-11"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading} className="bg-blue-500 hover:bg-blue-600 px-6">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Research"}
        </Button>
      </div>

      {!result && !loading && (
        <div className="text-center py-16">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400">Enter a company name to start researching</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {["Tesla", "Stripe", "Notion", "Figma", "Vercel"].map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-spin" />
          <p className="text-zinc-400">Researching {query}...</p>
          <p className="text-zinc-500 text-sm mt-1">Searching across multiple sources</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Company Header */}
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {result.name[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{result.name}</h2>
                  <p className="text-zinc-400 mt-1">{result.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {result.headquarters}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {result.size} employees</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Founded {result.founded}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {result.revenue}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href={`https://${result.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> Website
                    </a>
                    <a href="#" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                    <a href="#" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                      <Twitter className="w-3.5 h-3.5" /> Twitter
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tech Stack */}
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" /> Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-white/10 text-zinc-300">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key People */}
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" /> Key People
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.keyPeople.slice(0, 5).map((person, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center text-xs font-bold">
                        {person.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{person.name}</p>
                        <p className="text-xs text-zinc-400">{person.title}</p>
                      </div>
                      {person.email && (
                        <span className="text-xs text-emerald-400">{person.email}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funding */}
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Funding History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.funding.map((round, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{round.round} — {round.amount}</p>
                        <p className="text-xs text-zinc-400">{round.investors.join(", ")} • {round.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitors */}
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" /> Competitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.competitors.map((comp) => (
                    <div key={comp} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition">
                      <span className="text-sm">{comp}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* News */}
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-yellow-400" /> Recent News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.news.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition">
                    <Badge
                      className={`mt-0.5 border-0 text-xs ${
                        item.sentiment === "positive" ? "bg-emerald-500/20 text-emerald-400" :
                        item.sentiment === "negative" ? "bg-red-500/20 text-red-400" :
                        "bg-zinc-500/20 text-zinc-400"
                      }`}
                    >
                      {item.sentiment}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">{item.source} • {item.date}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
