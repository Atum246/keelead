"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus, Search, MoreHorizontal, Mail, Phone, Building2,
  MapPin, Star, GripVertical, Filter, ArrowRight, Users,
  ChevronRight, Eye
} from "lucide-react"

interface PipelineLead {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  title: string
  score: number
  source: string
  tags: string[]
  lastActivity: string
}

interface PipelineStage {
  id: string
  name: string
  color: string
  leads: PipelineLead[]
}

const initialStages: PipelineStage[] = [
  {
    id: "new", name: "New", color: "bg-blue-500",
    leads: [
      { id: "1", firstName: "Sarah", lastName: "Chen", email: "sarah@cloudsync.io", company: "CloudSync", title: "CEO", score: 95, source: "LinkedIn", tags: ["saas"], lastActivity: "2h ago" },
      { id: "2", firstName: "James", lastName: "Wilson", email: "james@techcorp.com", company: "TechCorp", title: "CTO", score: 88, source: "Crunchbase", tags: ["enterprise"], lastActivity: "5h ago" },
      { id: "3", firstName: "Emily", lastName: "Zhang", email: "emily@innovatelab.io", company: "InnovateLab", title: "VP Eng", score: 82, source: "GitHub", tags: ["startup"], lastActivity: "1d ago" },
      { id: "4", firstName: "Alex", lastName: "Rivera", email: "alex@newstartup.com", company: "NewStartup", title: "Founder", score: 91, source: "Web", tags: ["founder"], lastActivity: "3h ago" },
    ],
  },
  {
    id: "contacted", name: "Contacted", color: "bg-yellow-500",
    leads: [
      { id: "5", firstName: "Michael", lastName: "Brown", email: "michael@datavault.com", company: "DataVault", title: "Founder", score: 91, source: "LinkedIn", tags: ["security"], lastActivity: "2d ago" },
      { id: "6", firstName: "Lisa", lastName: "Park", email: "lisa@nexusai.com", company: "Nexus AI", title: "Head of Growth", score: 85, source: "LinkedIn", tags: ["ai"], lastActivity: "3d ago" },
    ],
  },
  {
    id: "qualified", name: "Qualified", color: "bg-purple-500",
    leads: [
      { id: "7", firstName: "David", lastName: "Kim", email: "david@vertexinc.com", company: "Vertex Inc", title: "Dir Sales", score: 78, source: "Web", tags: ["sales"], lastActivity: "1d ago" },
      { id: "8", firstName: "Jennifer", lastName: "Lee", email: "jen@apexdigital.com", company: "Apex Digital", title: "Marketing Mgr", score: 85, source: "Google Maps", tags: ["marketing"], lastActivity: "4d ago" },
    ],
  },
  {
    id: "won", name: "Won", color: "bg-emerald-500",
    leads: [
      { id: "9", firstName: "Robert", lastName: "Taylor", email: "rob@horizontech.io", company: "Horizon Tech", title: "Eng Lead", score: 92, source: "GitHub", tags: ["engineering"], lastActivity: "1w ago" },
    ],
  },
  {
    id: "lost", name: "Lost", color: "bg-red-500",
    leads: [],
  },
]

export default function PipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages)
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedLead, setDraggedLead] = useState<{ lead: PipelineLead; fromStage: string } | null>(null)

  const handleDragStart = (lead: PipelineLead, stageId: string) => {
    setDraggedLead({ lead, fromStage: stageId })
  }

  const handleDrop = (targetStageId: string) => {
    if (!draggedLead || draggedLead.fromStage === targetStageId) {
      setDraggedLead(null)
      return
    }
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === draggedLead.fromStage) {
          return { ...stage, leads: stage.leads.filter((l) => l.id !== draggedLead.lead.id) }
        }
        if (stage.id === targetStageId) {
          return { ...stage, leads: [...stage.leads, draggedLead.lead] }
        }
        return stage
      })
    )
    setDraggedLead(null)
  }

  const totalLeads = stages.reduce((a, s) => a + s.leads.length, 0)
  const totalValue = stages.reduce((a, s) => a + s.leads.reduce((b, l) => b + l.score, 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-zinc-400 text-sm mt-1">{totalLeads} leads • Avg score: {Math.round(totalValue / (totalLeads || 1))}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter leads..."
              className="pl-9 bg-white/5 border-white/10 w-48"
            />
          </div>
          <Button variant="outline" size="sm" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="flex gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
            <span className="text-sm text-zinc-400">{stage.name}</span>
            <Badge variant="outline" className="border-white/10 text-xs">{stage.leads.length}</Badge>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage.id)}
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="font-medium text-sm">{stage.name}</span>
                <Badge variant="outline" className="border-white/10 text-xs text-zinc-400">
                  {stage.leads.length}
                </Badge>
              </div>
              <button className="text-zinc-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-[200px] rounded-xl bg-white/[0.02] border border-white/5 p-2">
              {stage.leads
                .filter((lead) =>
                  `${lead.firstName} ${lead.lastName} ${lead.company}`.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead, stage.id)}
                  className="p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 cursor-grab active:cursor-grabbing transition group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                        {lead.firstName[0]}{lead.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{lead.firstName} {lead.lastName}</p>
                        <p className="text-xs text-zinc-400">{lead.title}</p>
                      </div>
                    </div>
                    <GripVertical className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-zinc-400">
                    <Building2 className="w-3 h-3" /> {lead.company}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-white/10 text-zinc-400 text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-medium">{lead.score}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-zinc-500">{lead.lastActivity}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button className="p-1 text-zinc-400 hover:text-blue-400">
                        <Mail className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-zinc-400 hover:text-blue-400">
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {stage.leads.length === 0 && (
                <div className="text-center py-8 text-zinc-600 text-xs">
                  Drop leads here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
