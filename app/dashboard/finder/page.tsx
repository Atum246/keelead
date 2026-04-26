"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search, User, Building2, MapPin, Briefcase, Mail, Phone,
  Linkedin, ExternalLink, Download, Loader2, Star, Filter
} from "lucide-react"

interface ContactResult {
  name: string
  email: string
  phone: string
  company: string
  title: string
  location: string
  linkedin: string
  source: string
  confidence: number
}

export default function FinderPage() {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ContactResult[]>([])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `Find ${name || "contacts"} ${company ? `at ${company}` : ""} ${title ? `with title ${title}` : ""} ${location ? `in ${location}` : ""}`, count: 20 }),
      })
      const data = await res.json()
      const mapped: ContactResult[] = (data.leads || []).map((l: Record<string, unknown>) => ({
        name: `${l.firstName} ${l.lastName}`,
        email: String(l.email || ""),
        phone: String(l.phone || ""),
        company: String(l.company || ""),
        title: String(l.title || ""),
        location: String(l.location || ""),
        linkedin: String(l.linkedin || ""),
        source: String(l.source || ""),
        confidence: Number(l.confidence || 0),
      }))
      setResults(mapped)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Finder</h1>
        <p className="text-zinc-400 text-sm mt-1">Find anyone by name, company, title, or location.</p>
      </div>

      {/* Search Form */}
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block flex items-center gap-1">
                <User className="w-3 h-3" /> Full Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Company
              </label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google, Tesla..." className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Job Title
              </label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CEO, Engineer..." className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, NYC..." className="bg-white/5 border-white/10" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Find Contacts
            </Button>
            {results.length > 0 && (
              <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" /> Export All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-10 h-10 mx-auto mb-3 text-blue-400 animate-spin" />
          <p className="text-zinc-400">Searching across 25+ sources...</p>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400">Search for contacts using the form above</p>
          <p className="text-zinc-500 text-sm mt-1">Try searching by name, company, or title</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">{results.length} contacts found</p>
          </div>
          {results.map((contact, i) => (
            <Card key={i} className="bg-[#0a0a0a] border-white/10 hover:border-white/20 transition">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold flex-shrink-0">
                    {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{contact.name}</h3>
                      <Badge variant="outline" className="border-white/10 text-zinc-400 text-xs">{contact.source}</Badge>
                    </div>
                    <p className="text-sm text-zinc-400">{contact.title} {contact.company ? `at ${contact.company}` : ""}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-zinc-500">
                      {contact.email && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </span>
                      )}
                      {contact.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {contact.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-sm font-medium">{Math.round(contact.confidence * 100)}%</span>
                    </div>
                    <div className="flex gap-1">
                      {contact.linkedin && (
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-blue-400">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-blue-400">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
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
