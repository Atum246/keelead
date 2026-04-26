"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Mail, CheckCircle2, XCircle, AlertTriangle, HelpCircle,
  Upload, Loader2, Shield, Globe, Server, Zap, Ban, AtSign
} from "lucide-react"

interface VerificationResult {
  email: string
  score: number
  status: "valid" | "invalid" | "catch-all" | "disposable" | "unknown"
  details: {
    syntax: boolean
    domain: boolean
    mx: boolean
    disposable: boolean
    roleBased: boolean
    freeProvider: boolean
    catchAll: boolean
    smtp: boolean
    spamTrap: boolean
    typoSuggestion?: string
  }
}

export default function VerifyPage() {
  const [emailInput, setEmailInput] = useState("")
  const [bulkInput, setBulkInput] = useState("")
  const [mode, setMode] = useState<"single" | "bulk">("single")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<VerificationResult[]>([])

  const handleVerify = async () => {
    const emails = mode === "single"
      ? [emailInput.trim()]
      : bulkInput.split("\n").map((e) => e.trim()).filter(Boolean)
    if (emails.length === 0) return
    setLoading(true)
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const statusIcons: Record<string, React.ReactNode> = {
    valid: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    invalid: <XCircle className="w-5 h-5 text-red-400" />,
    "catch-all": <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    disposable: <Ban className="w-5 h-5 text-orange-400" />,
    unknown: <HelpCircle className="w-5 h-5 text-zinc-400" />,
  }

  const statusColors: Record<string, string> = {
    valid: "bg-emerald-500/20 text-emerald-400",
    invalid: "bg-red-500/20 text-red-400",
    "catch-all": "bg-yellow-500/20 text-yellow-400",
    disposable: "bg-orange-500/20 text-orange-400",
    unknown: "bg-zinc-500/20 text-zinc-400",
  }

  const layers = [
    { icon: <AtSign className="w-4 h-4" />, name: "Syntax", key: "syntax" },
    { icon: <Globe className="w-4 h-4" />, name: "Domain", key: "domain" },
    { icon: <Server className="w-4 h-4" />, name: "MX Records", key: "mx" },
    { icon: <Ban className="w-4 h-4" />, name: "Disposable", key: "disposable" },
    { icon: <Shield className="w-4 h-4" />, name: "Role-based", key: "roleBased" },
    { icon: <Zap className="w-4 h-4" />, name: "SMTP", key: "smtp" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Email Verification</h1>
        <p className="text-zinc-400 text-sm mt-1">10-layer verification: syntax, MX, SMTP, disposable detection, and more.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("single")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "single" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
        >
          Single Email
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "bulk" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
        >
          Bulk Verify
        </button>
      </div>

      {/* Input */}
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardContent className="p-6">
          {mode === "single" ? (
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder="Enter email address to verify"
                  className="pl-9 bg-white/5 border-white/10 h-11"
                />
              </div>
              <Button onClick={handleVerify} disabled={loading} className="bg-blue-500 hover:bg-blue-600 px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Enter emails, one per line&#10;john@example.com&#10;jane@company.com&#10;test@domain.org"
                className="bg-white/5 border-white/10 min-h-[120px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleVerify} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                  Verify All ({bulkInput.split("\n").filter((e) => e.trim()).length} emails)
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  <Upload className="w-4 h-4 mr-2" /> Upload CSV
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(["valid", "invalid", "catch-all", "disposable", "unknown"] as const).map((status) => {
              const count = results.filter((r) => r.status === status).length
              return (
                <Card key={status} className="bg-[#0a0a0a] border-white/10">
                  <CardContent className="p-3 text-center">
                    {statusIcons[status]}
                    <p className="text-xl font-bold mt-1">{count}</p>
                    <p className="text-xs text-zinc-400 capitalize">{status}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Individual Results */}
          {results.map((result, i) => (
            <Card key={i} className="bg-[#0a0a0a] border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {statusIcons[result.status]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-medium">{result.email}</span>
                      <Badge className={`${statusColors[result.status]} border-0 text-xs`}>
                        {result.status}
                      </Badge>
                    </div>

                    {/* Score Bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-zinc-400 w-12">Score</span>
                      <Progress value={result.score} className="flex-1 h-2" />
                      <span className={`text-sm font-bold ${
                        result.score >= 70 ? "text-emerald-400" :
                        result.score >= 40 ? "text-yellow-400" :
                        "text-red-400"
                      }`}>{result.score}/100</span>
                    </div>

                    {/* Layer Results */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {layers.map((layer) => {
                        const passed = result.details[layer.key as keyof typeof result.details]
                        return (
                          <div
                            key={layer.key}
                            className={`flex items-center gap-1.5 p-2 rounded-lg text-xs ${
                              passed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {layer.icon}
                            <span>{layer.name}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Typo Suggestion */}
                    {result.details.typoSuggestion && (
                      <div className="mt-2 p-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs">
                        Did you mean <span className="font-bold">{result.details.typoSuggestion}</span>?
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
