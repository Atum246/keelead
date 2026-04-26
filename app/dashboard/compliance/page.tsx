"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, FileText,
  Download, Upload, Plus, Search, Clock, Users, Mail,
  Ban, Eye, Trash2, RefreshCw, Globe, Lock, List, Scale
} from "lucide-react"

interface DncEntry {
  id: string
  email: string
  reason: string
  addedAt: string
  source: "manual" | "opt-out" | "bounce" | "complaint"
}

interface AuditLogEntry {
  id: string
  action: string
  detail: string
  user: string
  timestamp: string
  type: "export" | "delete" | "modify" | "access" | "consent"
}

export default function CompliancePage() {
  const [gdprEnabled, setGdprEnabled] = useState(true)
  const [canSpamEnabled, setCanSpamEnabled] = useState(true)
  const [autoOptOut, setAutoOptOut] = useState(true)
  const [dncEntries] = useState<DncEntry[]>([
    { id: "1", email: "john@optout.com", reason: "User requested opt-out", addedAt: "2024-10-25 14:30", source: "opt-out" },
    { id: "2", email: "spam@trap.net", reason: "Spam trap detected", addedAt: "2024-10-24 09:15", source: "bounce" },
    { id: "3", email: "blocked@domain.com", reason: "Hard bounce", addedAt: "2024-10-23 16:45", source: "bounce" },
    { id: "4", email: "complaint@company.org", reason: "Spam complaint", addedAt: "2024-10-22 11:20", source: "complaint" },
    { id: "5", email: "removed@example.io", reason: "GDPR data deletion request", addedAt: "2024-10-21 08:00", source: "manual" },
  ])
  const [auditLogs] = useState<AuditLogEntry[]>([
    { id: "1", action: "Data Export", detail: "Exported 1,234 leads to CSV", user: "john@keelead.io", timestamp: "2024-10-25 14:30:00", type: "export" },
    { id: "2", action: "Lead Deleted", detail: "GDPR deletion: john@optout.com", user: "system", timestamp: "2024-10-25 14:25:00", type: "delete" },
    { id: "3", action: "DNC List Updated", detail: "Added 3 emails to DNC list", user: "admin@keelead.io", timestamp: "2024-10-25 13:15:00", type: "modify" },
    { id: "4", action: "Campaign Sent", detail: "Q4 Outreach: 45 emails sent", user: "john@keelead.io", timestamp: "2024-10-25 10:00:00", type: "access" },
    { id: "5", action: "Consent Recorded", detail: "Opt-in confirmed: sarah@cloudsync.io", user: "system", timestamp: "2024-10-24 16:30:00", type: "consent" },
    { id: "6", action: "Data Export", detail: "Exported 567 leads to JSON", user: "jane@keelead.io", timestamp: "2024-10-24 11:45:00", type: "export" },
    { id: "7", action: "Lead Modified", detail: "Updated consent status: mike@data.io", user: "john@keelead.io", timestamp: "2024-10-24 09:20:00", type: "modify" },
  ])

  const typeColors: Record<string, string> = {
    export: "bg-blue-500/20 text-blue-400",
    delete: "bg-red-500/20 text-red-400",
    modify: "bg-yellow-500/20 text-yellow-400",
    access: "bg-purple-500/20 text-purple-400",
    consent: "bg-emerald-500/20 text-emerald-400",
  }

  const sourceColors: Record<string, string> = {
    manual: "bg-blue-500/20 text-blue-400",
    "opt-out": "bg-yellow-500/20 text-yellow-400",
    bounce: "bg-orange-500/20 text-orange-400",
    complaint: "bg-red-500/20 text-red-400",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compliance</h1>
        <p className="text-zinc-400 text-sm mt-1">GDPR, CAN-SPAM, DNC lists, opt-out management, and audit logs.</p>
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium">GDPR Compliant</p>
                <p className="text-xs text-zinc-400">EU data protection</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium">CAN-SPAM Compliant</p>
                <p className="text-xs text-zinc-400">US email regulations</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <List className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium">DNC List</p>
                <p className="text-xs text-zinc-400">{dncEntries.length} entries</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-0 ml-auto">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/10">
            <Shield className="w-4 h-4 mr-2" /> Settings
          </TabsTrigger>
          <TabsTrigger value="dnc" className="data-[state=active]:bg-white/10">
            <Ban className="w-4 h-4 mr-2" /> DNC List
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-white/10">
            <FileText className="w-4 h-4 mr-2" /> Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Compliance Settings</CardTitle>
              <CardDescription>Configure data protection and email compliance rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "gdpr", label: "GDPR Compliance", desc: "Enforce EU data protection regulations (consent, right to erasure, data portability)", state: gdprEnabled, setter: setGdprEnabled },
                { key: "canspam", label: "CAN-SPAM Compliance", desc: "Include unsubscribe links, physical address, and accurate headers in all emails", state: canSpamEnabled, setter: setCanSpamEnabled },
                { key: "autoopt", label: "Auto Opt-Out Processing", desc: "Automatically process opt-out requests and add to DNC list", state: autoOptOut, setter: setAutoOptOut },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                  <Switch checked={item.state} onCheckedChange={item.setter} />
                </div>
              ))}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <label className="text-sm font-medium mb-2 block">Default Email Footer</label>
                <Textarea
                  defaultValue={`You're receiving this because of your professional role.\nUnsubscribe: {{unsubscribe_link}}\nKeeLead Inc, 123 Market St, San Francisco, CA`}
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DNC List */}
        <TabsContent value="dnc" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input placeholder="Search DNC list..." className="pl-9 bg-white/5 border-white/10 w-64" />
              </div>
              <Button variant="outline" size="sm" className="border-white/10">
                <Upload className="w-4 h-4 mr-2" /> Import
              </Button>
            </div>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Add Entry
            </Button>
          </div>
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-zinc-400 font-medium text-xs">Email</th>
                    <th className="text-left p-3 text-zinc-400 font-medium text-xs">Reason</th>
                    <th className="text-left p-3 text-zinc-400 font-medium text-xs">Source</th>
                    <th className="text-left p-3 text-zinc-400 font-medium text-xs">Added</th>
                    <th className="text-right p-3 text-zinc-400 font-medium text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dncEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3 font-mono text-sm">{entry.email}</td>
                      <td className="p-3 text-zinc-400">{entry.reason}</td>
                      <td className="p-3">
                        <Badge className={`${sourceColors[entry.source]} border-0 text-xs`}>{entry.source}</Badge>
                      </td>
                      <td className="p-3 text-zinc-400 text-xs">{entry.addedAt}</td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log */}
        <TabsContent value="audit" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">{auditLogs.length} entries in audit log</p>
            <Button variant="outline" size="sm" className="border-white/10">
              <Download className="w-4 h-4 mr-2" /> Export Log
            </Button>
          </div>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <Card key={log.id} className="bg-[#0a0a0a] border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[log.type]}`}>
                      {log.type === "export" ? <Download className="w-4 h-4" /> :
                       log.type === "delete" ? <Trash2 className="w-4 h-4" /> :
                       log.type === "modify" ? <RefreshCw className="w-4 h-4" /> :
                       log.type === "consent" ? <CheckCircle2 className="w-4 h-4" /> :
                       <Eye className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{log.action}</p>
                        <Badge className={`${typeColors[log.type]} border-0 text-xs`}>{log.type}</Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mt-0.5">{log.detail}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                        <span>{log.user}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
