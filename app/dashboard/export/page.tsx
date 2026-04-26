"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download, FileSpreadsheet, FileJson, FileText, User, File,
  Filter, ChevronDown, Loader2, CheckCircle2, Clock, Table
} from "lucide-react"

export default function ExportPage() {
  const [format, setFormat] = useState("csv")
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(["firstName", "lastName", "email", "phone", "company", "title", "location", "source", "status", "verified"])
  )
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  const formats = [
    { id: "csv", name: "CSV", icon: <FileSpreadsheet className="w-5 h-5" />, desc: "Comma-separated values" },
    { id: "json", name: "JSON", icon: <FileJson className="w-5 h-5" />, desc: "JavaScript Object Notation" },
    { id: "xlsx", name: "Excel", icon: <Table className="w-5 h-5" />, desc: "Microsoft Excel format" },
    { id: "vcard", name: "vCard", icon: <User className="w-5 h-5" />, desc: "Contact card format" },
    { id: "pdf", name: "PDF", icon: <FileText className="w-5 h-5" />, desc: "Portable Document Format" },
  ]

  const fields = [
    "firstName", "lastName", "email", "phone", "company", "title",
    "website", "linkedin", "location", "source", "status", "verified", "score", "tags", "notes"
  ]

  const toggleField = (field: string) => {
    const next = new Set(selectedFields)
    if (next.has(field)) next.delete(field)
    else next.add(field)
    setSelectedFields(next)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, fields: Array.from(selectedFields), filters: { status: statusFilter, source: sourceFilter } }),
      })
      const data = await res.json()
      if (data.url) {
        window.open(data.url, "_blank")
      }
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch {} finally {
      setExporting(false)
    }
  }

  const exportHistory = [
    { id: "1", format: "CSV", count: 1234, date: "2024-10-25 14:30", size: "245 KB" },
    { id: "2", format: "JSON", count: 567, date: "2024-10-24 09:15", size: "189 KB" },
    { id: "3", format: "Excel", count: 2345, date: "2024-10-23 16:45", size: "512 KB" },
    { id: "4", format: "vCard", count: 89, date: "2024-10-22 11:20", size: "34 KB" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Export Center</h1>
        <p className="text-zinc-400 text-sm mt-1">Export leads in CSV, JSON, Excel, vCard, or PDF format.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Format Selection */}
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Export Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                  format === f.id ? "bg-blue-500/20 border border-blue-500/30" : "bg-white/5 border border-transparent hover:bg-white/10"
                }`}
              >
                <div className={format === f.id ? "text-blue-400" : "text-zinc-400"}>{f.icon}</div>
                <div className="text-left">
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-zinc-400">{f.desc}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Fields & Filters */}
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Fields to Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {fields.map((field) => (
                <label key={field} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
                  <Checkbox
                    checked={selectedFields.has(field)}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <span className="text-sm">{field}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Source Filter</label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="all">All Sources</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="crunchbase">Crunchbase</option>
                  <option value="github">GitHub</option>
                  <option value="web">Web Search</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Action */}
        <div className="space-y-4">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Format</span>
                <span className="font-medium uppercase">{format}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Fields</span>
                <span className="font-medium">{selectedFields.size} selected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Status Filter</span>
                <span className="font-medium capitalize">{statusFilter}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Estimated Leads</span>
                <span className="font-medium">12,847</span>
              </div>
              <Button
                onClick={handleExport}
                disabled={exporting}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
              >
                {exporting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Exporting...</>
                ) : exported ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" /> Exported!</>
                ) : (
                  <><Download className="w-4 h-4 mr-2" /> Export Now</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Export History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exportHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                    <File className="w-4 h-4 text-zinc-400" />
                    <div className="flex-1">
                      <p className="text-sm">{item.count.toLocaleString()} leads</p>
                      <p className="text-xs text-zinc-400">{item.date}</p>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-zinc-400 text-xs">{item.format}</Badge>
                    <span className="text-xs text-zinc-500">{item.size}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
