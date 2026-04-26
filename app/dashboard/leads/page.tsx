"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search, Plus, Download, Trash2, Tag, Filter,
  ChevronDown, MoreHorizontal, Mail, Phone, Globe, Linkedin, Eye
} from "lucide-react"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  title: string
  source: string
  status: string
  verified: boolean
  score: number
  tags: string[]
}

const demoLeads: Lead[] = [
  { id: "1", firstName: "Sarah", lastName: "Chen", email: "sarah@cloudsync.io", phone: "+1 415-555-0123", company: "CloudSync", title: "CEO", source: "LinkedIn", status: "new", verified: true, score: 95, tags: ["saas", "founder"] },
  { id: "2", firstName: "James", lastName: "Wilson", email: "james@techcorp.com", phone: "+1 628-555-0456", company: "TechCorp", title: "CTO", source: "Crunchbase", status: "contacted", verified: true, score: 88, tags: ["tech", "enterprise"] },
  { id: "3", firstName: "Emily", lastName: "Zhang", email: "emily@innovatelab.io", phone: "+1 510-555-0789", company: "InnovateLab", title: "VP Engineering", source: "GitHub", status: "qualified", verified: false, score: 82, tags: ["startup", "ai"] },
  { id: "4", firstName: "Michael", lastName: "Brown", email: "michael@datavault.com", phone: "+1 650-555-0321", company: "DataVault", title: "Founder", source: "Web Search", status: "new", verified: true, score: 91, tags: ["security", "founder"] },
  { id: "5", firstName: "Lisa", lastName: "Park", email: "lisa@nexusai.com", phone: "+1 408-555-0654", company: "Nexus AI", title: "Head of Growth", source: "LinkedIn", status: "converted", verified: true, score: 97, tags: ["ai", "growth"] },
  { id: "6", firstName: "David", lastName: "Kim", email: "david@vertexinc.com", phone: "+1 212-555-0987", company: "Vertex Inc", title: "Director of Sales", source: "Yelp", status: "new", verified: false, score: 74, tags: ["sales", "enterprise"] },
  { id: "7", firstName: "Jennifer", lastName: "Lee", email: "jen@apexdigital.com", phone: "+1 310-555-0147", company: "Apex Digital", title: "Marketing Manager", source: "Google Maps", status: "contacted", verified: true, score: 85, tags: ["marketing", "digital"] },
  { id: "8", firstName: "Robert", lastName: "Taylor", email: "rob@horizontech.io", phone: "+1 617-555-0258", company: "Horizon Tech", title: "Engineering Lead", source: "GitHub", status: "new", verified: true, score: 79, tags: ["engineering", "startup"] },
]

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(demoLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = `${lead.firstName} ${lead.lastName} ${lead.company} ${lead.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedLeads)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedLeads(next)
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400",
    contacted: "bg-yellow-500/20 text-yellow-400",
    qualified: "bg-purple-500/20 text-purple-400",
    converted: "bg-emerald-500/20 text-emerald-400",
    lost: "bg-red-500/20 text-red-400",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-zinc-400 text-sm mt-1">{leads.length} total leads • {leads.filter((l) => l.verified).length} verified</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "new", "contacted", "qualified", "converted"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === status
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {selectedLeads.size > 0 && (
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="border-white/10 text-xs">
              <Tag className="w-3 h-3 mr-1" /> Tag ({selectedLeads.size})
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 text-xs">
              <Download className="w-3 h-3 mr-1" /> Export ({selectedLeads.size})
            </Button>
            <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 text-xs hover:bg-red-500/10">
              <Trash2 className="w-3 h-3 mr-1" /> Delete ({selectedLeads.size})
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 w-10">
                    <Checkbox checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0} onCheckedChange={toggleSelectAll} />
                  </th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Name</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Company</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Title</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Email</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Source</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Status</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Score</th>
                  <th className="text-left p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selectedLeads.has(lead.id)} onCheckedChange={() => toggleSelect(lead.id)} />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                          {lead.firstName[0]}{lead.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                          <p className="text-xs text-zinc-400">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-zinc-300">{lead.company}</td>
                    <td className="p-3 text-zinc-400">{lead.title}</td>
                    <td className="p-3">
                      <span className={lead.verified ? "text-emerald-400" : "text-zinc-400"}>
                        {lead.email}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="border-white/10 text-zinc-400 text-xs">
                        {lead.source}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={`${statusColors[lead.status]} border-0 text-xs`}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              lead.score >= 90 ? "bg-emerald-500" : lead.score >= 70 ? "bg-blue-500" : "bg-yellow-500"
                            }`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-400">{lead.score}</span>
                      </div>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Sidebar */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-white/10 h-full overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Lead Details</h2>
                <button onClick={() => setSelectedLead(null)} className="text-zinc-400 hover:text-white">
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-lg font-bold">
                  {selectedLead.firstName[0]}{selectedLead.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedLead.firstName} {selectedLead.lastName}</h3>
                  <p className="text-zinc-400">{selectedLead.title} at {selectedLead.company}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Email</p>
                    <p className={selectedLead.verified ? "text-emerald-400" : ""}>{selectedLead.email}</p>
                  </div>
                  {selectedLead.verified && <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-0 text-xs">Verified</Badge>}
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Phone</p>
                    <p>{selectedLead.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Globe className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Website</p>
                    <p className="text-blue-400">{selectedLead.company.toLowerCase().replace(/\s+/g, "")}.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Linkedin className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">LinkedIn</p>
                    <p className="text-blue-400">linkedin.com/in/{selectedLead.firstName.toLowerCase()}-{selectedLead.lastName.toLowerCase()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-zinc-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-white/10 text-zinc-300">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-zinc-400 mb-2">Status</p>
                <div className="flex gap-2">
                  {["new", "contacted", "qualified", "converted"].map((s) => (
                    <button
                      key={s}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedLead.status === s
                          ? statusColors[s]
                          : "text-zinc-400 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                  <Mail className="w-4 h-4 mr-2" /> Send Email
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  <Eye className="w-4 h-4 mr-2" /> Research
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
