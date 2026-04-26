"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search, Mail, Building2, Users, Download, MessageSquare,
  Shield, Zap, Globe, BarChart3, Bot, Rocket, ChevronRight,
  Github, Star
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-sm">K</div>
            <span className="text-xl font-bold">KeeLead</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="https://github.com/keelead/keelead" className="hover:text-white transition flex items-center gap-1">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/chat">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/chat">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
                Get Started <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400 mb-6">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            Open Source & Free Forever
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">AI-Powered</span>
            <br />Lead Generation Engine
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Find leads, verify emails, research companies, and grow your business — all through a natural language chat interface. Open source, self-hosted, privacy-first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-base px-8">
                <MessageSquare className="w-5 h-5 mr-2" /> Start Chatting
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-base px-8 border-white/20 hover:bg-white/5">
                <BarChart3 className="w-5 h-5 mr-2" /> View Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Self-Hosted</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Multi-AI Provider</span>
            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> 25+ Data Sources</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Generate Leads</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              A complete toolkit powered by AI, with 25+ data sources and multi-layer verification.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="bg-[#0a0a0a] border-white/10 hover:border-white/20 transition group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-400 text-lg">Three simple steps to find your next customers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Demo */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Just Ask in Plain English</h2>
            <p className="text-zinc-400 text-lg">No complex filters. Just tell KeeLead what you need.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex gap-3 justify-end">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                <p className="text-sm">Find me 50 SaaS founders in San Francisco with their emails</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <p className="text-sm text-zinc-300 mb-3">I found <span className="text-blue-400 font-semibold">47 SaaS founders</span> in San Francisco. Here are the top results:</p>
                <div className="bg-black/50 rounded-lg p-3 text-xs font-mono">
                  <div className="grid grid-cols-4 gap-2 text-zinc-500 mb-2">
                    <span>Name</span><span>Company</span><span>Title</span><span>Email</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-zinc-300">
                    <span>Sarah Chen</span><span>CloudSync</span><span>CEO</span><span className="text-emerald-400">sarah@cloudsync.io</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-2">47 results from LinkedIn, Crunchbase, Web Search • Confidence: 87%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-zinc-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Generate Leads?</h2>
          <p className="text-zinc-400 text-lg mb-8">
            Self-host in 5 minutes. No API keys required for demo mode. Start finding leads today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-base px-8">
                <Rocket className="w-5 h-5 mr-2" /> Launch KeeLead
              </Button>
            </Link>
            <a href="https://github.com/keelead/keelead" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base px-8 border-white/20 hover:bg-white/5">
                <Github className="w-5 h-5 mr-2" /> View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">K</div>
            <span className="font-semibold">KeeLead</span>
            <span className="text-zinc-500 text-sm">© 2024 Open Source</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition">Docs</a>
            <a href="#" className="hover:text-white transition">API</a>
            <a href="https://github.com/keelead/keelead" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  { icon: <MessageSquare className="w-6 h-6 text-blue-400" />, title: "AI Chat Interface", description: "Find leads using natural language. Just ask — like talking to a sales assistant." },
  { icon: <Search className="w-6 h-6 text-emerald-400" />, title: "25+ Data Sources", description: "Search across LinkedIn, Crunchbase, GitHub, Google Maps, Yelp, and 20+ more sources." },
  { icon: <Mail className="w-6 h-6 text-blue-400" />, title: "Email Verification", description: "10-layer verification: syntax, MX records, SMTP, disposable detection, and more." },
  { icon: <Building2 className="w-6 h-6 text-emerald-400" />, title: "Company Research", description: "Deep company profiles: tech stack, funding, key people, competitors, and news." },
  { icon: <Users className="w-6 h-6 text-blue-400" />, title: "Contact Finder", description: "Find anyone by name, company, title, or location with confidence scores." },
  { icon: <Download className="w-6 h-6 text-emerald-400" />, title: "Multi-Format Export", description: "Export to CSV, JSON, Excel, vCard, or PDF. Filter and customize before export." },
  { icon: <Bot className="w-6 h-6 text-blue-400" />, title: "Multi-AI Support", description: "Works with OpenAI, Claude, OpenRouter, NVIDIA, and local Ollama models." },
  { icon: <Shield className="w-6 h-6 text-emerald-400" />, title: "Self-Hosted & Private", description: "Your data stays on your server. No third-party tracking. Full control." },
  { icon: <Zap className="w-6 h-6 text-blue-400" />, title: "Campaign Manager", description: "Create outreach campaigns, track opens and replies, manage lead pipelines." },
]

const steps = [
  { title: "Ask a Question", description: "Type what you need in plain English: 'Find SaaS founders in NYC'" },
  { title: "AI Searches 25+ Sources", description: "Our engine searches LinkedIn, Crunchbase, web, and more in parallel." },
  { title: "Get Verified Leads", description: "Results with emails, phones, confidence scores — ready to export." },
]

const stats = [
  { value: "25+", label: "Data Sources" },
  { value: "10", label: "Verification Layers" },
  { value: "∞", label: "Self-Hosted" },
  { value: "0$", label: "Forever Free" },
]
