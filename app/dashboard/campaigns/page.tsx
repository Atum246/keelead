"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Plus, Megaphone, Users, Mail, TrendingUp, Pause, Play,
  MoreHorizontal, Target, BarChart3, Send
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  description: string
  status: string
  type: string
  targetLeads: number
  sentCount: number
  openRate: number
  replyRate: number
  createdAt: string
}

const demoCampaigns: Campaign[] = [
  { id: "1", name: "Q4 SaaS Outreach", description: "Target SaaS founders in Bay Area", status: "active", type: "email", targetLeads: 500, sentCount: 342, openRate: 45.2, replyRate: 12.3, createdAt: "2024-10-01" },
  { id: "2", name: "Enterprise Decision Makers", description: "CTOs and VPs at Fortune 500", status: "active", type: "multi", targetLeads: 200, sentCount: 156, openRate: 52.1, replyRate: 18.7, createdAt: "2024-09-15" },
  { id: "3", name: "Startup Founders NYC", description: "Early-stage founders in New York", status: "paused", type: "email", targetLeads: 300, sentCount: 89, openRate: 38.4, replyRate: 8.9, createdAt: "2024-10-10" },
  { id: "4", name: "Tech Conference Follow-up", description: "Leads from TechCrunch Disrupt", status: "completed", type: "linkedin", targetLeads: 150, sentCount: 150, openRate: 61.3, replyRate: 22.1, createdAt: "2024-08-20" },
  { id: "5", name: "Product Hunt Launch", description: "Early adopters and beta testers", status: "draft", type: "email", targetLeads: 1000, sentCount: 0, openRate: 0, replyRate: 0, createdAt: "2024-10-25" },
]

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(demoCampaigns)
  const [showCreate, setShowCreate] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = campaigns.filter((c) => statusFilter === "all" || c.status === statusFilter)

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400",
    paused: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-blue-500/20 text-blue-400",
    draft: "bg-zinc-500/20 text-zinc-400",
  }

  const typeIcons: Record<string, React.ReactNode> = {
    email: <Mail className="w-4 h-4" />,
    linkedin: <Users className="w-4 h-4" />,
    multi: <Target className="w-4 h-4" />,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-zinc-400 text-sm mt-1">{campaigns.length} campaigns • {campaigns.filter((c) => c.status === "active").length} active</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm" className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Megaphone className="w-4 h-4" /> Total Campaigns
            </div>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Send className="w-4 h-4" /> Emails Sent
            </div>
            <div className="text-2xl font-bold">{campaigns.reduce((a, c) => a + c.sentCount, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Mail className="w-4 h-4" /> Avg Open Rate
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {(campaigns.filter((c) => c.openRate > 0).reduce((a, c) => a + c.openRate, 0) / campaigns.filter((c) => c.openRate > 0).length || 0).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <TrendingUp className="w-4 h-4" /> Avg Reply Rate
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {(campaigns.filter((c) => c.replyRate > 0).reduce((a, c) => a + c.replyRate, 0) / campaigns.filter((c) => c.replyRate > 0).length || 0).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "active", "paused", "completed", "draft"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === status ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((campaign) => (
          <Card key={campaign.id} className="bg-[#0a0a0a] border-white/10 hover:border-white/20 transition">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    campaign.status === "active" ? "bg-emerald-500/20" : "bg-white/5"
                  }`}>
                    {typeIcons[campaign.type] || <Megaphone className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-xs text-zinc-400">{campaign.description}</p>
                  </div>
                </div>
                <Badge className={`${statusColors[campaign.status]} border-0 text-xs`}>
                  {campaign.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-zinc-400">Sent</p>
                  <p className="font-bold text-sm">{campaign.sentCount}/{campaign.targetLeads}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-zinc-400">Open Rate</p>
                  <p className="font-bold text-sm text-emerald-400">{campaign.openRate}%</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-zinc-400">Reply Rate</p>
                  <p className="font-bold text-sm text-blue-400">{campaign.replyRate}%</p>
                </div>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                  style={{ width: `${(campaign.sentCount / campaign.targetLeads) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Created {campaign.createdAt}</span>
                <div className="flex gap-1">
                  {campaign.status === "active" ? (
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-yellow-400">
                      <Pause className="w-3.5 h-3.5" />
                    </Button>
                  ) : campaign.status === "paused" ? (
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-emerald-400">
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>Set up a new outreach campaign</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Campaign Name</label>
              <Input placeholder="e.g., Q1 SaaS Outreach" className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea placeholder="Describe your campaign goals..." className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Campaign Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["Email", "LinkedIn", "Multi-channel"].map((type) => (
                  <button key={type} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 text-sm transition">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">Create Campaign</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
