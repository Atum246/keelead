"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Mail, Plus, Play, Pause, Copy, Trash2, MoreHorizontal,
  Clock, Users, TrendingUp, ArrowRight, Sparkles, Send,
  BarChart3, Eye, MousePointerClick, Reply, Loader2, Wand2
} from "lucide-react"

interface SequenceStep {
  id: string
  type: "email" | "delay" | "condition"
  subject?: string
  body?: string
  delayDays?: number
  condition?: string
}

interface Sequence {
  id: string
  name: string
  description: string
  status: "active" | "draft" | "paused"
  steps: SequenceStep[]
  stats: { enrolled: number; sent: number; opened: number; clicked: number; replied: number }
  createdAt: string
}

const demoSequences: Sequence[] = [
  {
    id: "1", name: "SaaS Founder Outreach", description: "5-step sequence for SaaS founders",
    status: "active", createdAt: "2024-10-15",
    steps: [
      { id: "s1", type: "email", subject: "Quick question about {{company}}", body: "Hi {{firstName}},\n\nI noticed {{company}} is growing fast..." },
      { id: "s2", type: "delay", delayDays: 3 },
      { id: "s3", type: "email", subject: "Following up — {{company}} growth", body: "Hi {{firstName}},\n\nWanted to circle back..." },
      { id: "s4", type: "delay", delayDays: 5 },
      { id: "s5", type: "email", subject: "Last try — quick 10 min?", body: "Hi {{firstName}},\n\nI'll keep this brief..." },
    ],
    stats: { enrolled: 450, sent: 1230, opened: 567, clicked: 123, replied: 45 },
  },
  {
    id: "2", name: "Enterprise Decision Makers", description: "Multi-touch sequence for C-level execs",
    status: "active", createdAt: "2024-10-10",
    steps: [
      { id: "s1", type: "email", subject: "{{firstName}}, strategic question", body: "..." },
      { id: "s2", type: "delay", delayDays: 2 },
      { id: "s3", type: "email", subject: "Case study: How {{similar_company}} scaled", body: "..." },
    ],
    stats: { enrolled: 200, sent: 400, opened: 210, clicked: 56, replied: 28 },
  },
  {
    id: "3", name: "Startup Seed Round", description: "Congratulate on funding and offer value",
    status: "draft", createdAt: "2024-10-25",
    steps: [
      { id: "s1", type: "email", subject: "Congrats on the {{round}}!", body: "..." },
    ],
    stats: { enrolled: 0, sent: 0, opened: 0, clicked: 0, replied: 0 },
  },
]

export default function SequencesPage() {
  const [sequences] = useState<Sequence[]>(demoSequences)
  const [showBuilder, setShowBuilder] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")

  const handleAiGenerate = async () => {
    setAiGenerating(true)
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2000))
    setAiGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Sequences</h1>
          <p className="text-zinc-400 text-sm mt-1">Build drip campaigns with AI-powered email writing.</p>
        </div>
        <Button onClick={() => setShowBuilder(true)} size="sm" className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" /> New Sequence
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Active Sequences", value: sequences.filter((s) => s.status === "active").length, icon: <Mail className="w-4 h-4 text-blue-400" /> },
          { label: "Total Enrolled", value: sequences.reduce((a, s) => a + s.stats.enrolled, 0).toLocaleString(), icon: <Users className="w-4 h-4 text-emerald-400" /> },
          { label: "Emails Sent", value: sequences.reduce((a, s) => a + s.stats.sent, 0).toLocaleString(), icon: <Send className="w-4 h-4 text-purple-400" /> },
          { label: "Open Rate", value: `${((sequences.reduce((a, s) => a + s.stats.opened, 0) / sequences.reduce((a, s) => a + s.stats.sent, 1)) * 100).toFixed(1)}%`, icon: <Eye className="w-4 h-4 text-yellow-400" /> },
          { label: "Reply Rate", value: `${((sequences.reduce((a, s) => a + s.stats.replied, 0) / sequences.reduce((a, s) => a + s.stats.sent, 1)) * 100).toFixed(1)}%`, icon: <Reply className="w-4 h-4 text-orange-400" /> },
        ].map((stat) => (
          <Card key={stat.label} className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">{stat.icon} {stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sequences */}
      <div className="space-y-4">
        {sequences.map((seq) => (
          <Card key={seq.id} className="bg-[#0a0a0a] border-white/10 hover:border-white/20 transition">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{seq.name}</h3>
                    <Badge className={`border-0 text-xs ${
                      seq.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                      seq.status === "paused" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-zinc-500/20 text-zinc-400"
                    }`}>{seq.status}</Badge>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">{seq.description}</p>
                </div>
                <div className="flex gap-1">
                  {seq.status === "active" ? (
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-yellow-400">
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-emerald-400">
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Steps Preview */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {seq.steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                    <div className={`px-3 py-2 rounded-lg text-xs ${
                      step.type === "email" ? "bg-blue-500/20 text-blue-400" :
                      step.type === "delay" ? "bg-zinc-500/20 text-zinc-400" :
                      "bg-purple-500/20 text-purple-400"
                    }`}>
                      {step.type === "email" ? (
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {step.subject?.slice(0, 25)}...</span>
                      ) : step.type === "delay" ? (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {step.delayDays}d</span>
                      ) : (
                        <span>Condition</span>
                      )}
                    </div>
                    {i < seq.steps.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-600" />}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: "Enrolled", value: seq.stats.enrolled, icon: <Users className="w-3 h-3" /> },
                  { label: "Sent", value: seq.stats.sent, icon: <Send className="w-3 h-3" /> },
                  { label: "Opened", value: seq.stats.opened, icon: <Eye className="w-3 h-3" /> },
                  { label: "Clicked", value: seq.stats.clicked, icon: <MousePointerClick className="w-3 h-3" /> },
                  { label: "Replied", value: seq.stats.replied, icon: <Reply className="w-3 h-3" /> },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-2 rounded-lg bg-white/5">
                    <div className="flex items-center justify-center gap-1 text-zinc-400 text-xs mb-1">{stat.icon} {stat.label}</div>
                    <p className="font-bold text-sm">{stat.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Sequence Dialog */}
      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Email Sequence</DialogTitle>
            <DialogDescription>Build a drip campaign or use AI to generate emails.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Sequence Name</label>
              <Input placeholder="e.g., SaaS Founder Outreach" className="bg-white/5 border-white/10" />
            </div>

            {/* AI Email Writer */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">AI Email Writer</span>
                </div>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your outreach goal... e.g., 'Write a 3-step sequence for SaaS founders, focusing on our AI analytics platform that helps reduce churn by 30%'"
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
                <Button
                  onClick={handleAiGenerate}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="mt-3 bg-purple-500 hover:bg-purple-600"
                >
                  {aiGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
                  ) : (
                    <><Wand2 className="w-4 h-4 mr-2" /> Generate with AI</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Steps */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sequence Steps</label>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                    <Mail className="w-4 h-4" /> Step 1: Initial Email
                  </div>
                  <Input placeholder="Subject line" className="bg-white/5 border-white/10 mb-2" />
                  <Textarea placeholder="Email body..." className="bg-white/5 border-white/10 min-h-[60px]" />
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center text-sm text-zinc-400">
                  <Clock className="w-4 h-4 mx-auto mb-1" /> Wait 3 days
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                    <Mail className="w-4 h-4" /> Step 2: Follow-up
                  </div>
                  <Input placeholder="Subject line" className="bg-white/5 border-white/10 mb-2" />
                  <Textarea placeholder="Email body..." className="bg-white/5 border-white/10 min-h-[60px]" />
                </div>
                <Button variant="outline" className="w-full border-dashed border-white/20 hover:bg-white/5">
                  <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
              </div>
            </div>

            <Button className="w-full bg-blue-500 hover:bg-blue-600">Create Sequence</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
