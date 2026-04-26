"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send, Plus, MessageSquare, Trash2, MoreHorizontal,
  Copy, RefreshCw, Download, Bot, User, Search, Building2,
  Mail, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft
} from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentConversation = conversations.find((c) => c.id === activeConversation)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [activeConversation])

  const createConversation = () => {
    const id = Math.random().toString(36).substring(7)
    const conv: Conversation = {
      id,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations((prev) => [conv, ...prev])
    setActiveConversation(id)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConversation === id) {
      setActiveConversation(conversations[0]?.id || null)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    if (!activeConversation) createConversation()

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const convId = activeConversation || conversations[0]?.id
    if (!convId) return

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              title: c.messages.length === 0 ? input.slice(0, 40) : c.title,
              messages: [...c.messages, userMessage],
              updatedAt: new Date(),
            }
          : c
      )
    )
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationId: convId,
        }),
      })
      const data = await response.json()

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.content || "I processed your request.",
        timestamp: new Date(),
        metadata: data.metadata,
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: new Date() }
            : c
        )
      )
    } catch {
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, errorMessage], updatedAt: new Date() }
            : c
        )
      )
    } finally {
      setIsTyping(false)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const suggestions = [
    { icon: <Search className="w-4 h-4" />, text: "Find 20 SaaS founders in San Francisco" },
    { icon: <Building2 className="w-4 h-4" />, text: "Research company Tesla" },
    { icon: <Mail className="w-4 h-4" />, text: "Verify email: test@example.com" },
    { icon: <Search className="w-4 h-4" />, text: "Find restaurants in NYC with emails" },
  ]

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-white/10 bg-[#050505] flex flex-col overflow-hidden flex-shrink-0`}>
        <div className="p-3 border-b border-white/10">
          <Button onClick={createConversation} className="w-full justify-start gap-2 bg-white/5 hover:bg-white/10 border border-white/10" variant="ghost">
            <Plus className="w-4 h-4" /> New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 group transition ${
                  activeConversation === conv.id
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat above</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-white/10">
          <a href="/dashboard" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition px-2 py-1.5">
            <BarChart3 className="w-4 h-4" /> Dashboard
          </a>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-white/10 flex items-center px-4 gap-3 bg-black/50 backdrop-blur-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-white transition">
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-medium truncate">
              {currentConversation?.title || "KeeLead AI Assistant"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="text-zinc-400 hover:text-white transition">
              <BarChart3 className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto py-6 px-4">
            {!currentConversation?.messages.length ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mb-6">
                  <Bot className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold mb-2">KeeLead AI</h1>
                <p className="text-zinc-400 mb-8 max-w-md">
                  Your AI-powered lead generation assistant. Ask me to find leads, verify emails, or research companies.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(s.text); inputRef.current?.focus() }}
                      className="text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition group"
                    >
                      <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition">
                        {s.icon}
                        <span className="text-sm">{s.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {currentConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-blue-500/20 border border-blue-500/30 rounded-tr-sm"
                            : "bg-white/5 border border-white/10 rounded-tl-sm"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="markdown-body text-sm">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                        {/* Lead results table */}
                        {(() => {
                          const leads = msg.metadata?.leads;
                          if (!leads || !Array.isArray(leads)) return null;
                          return (
                          <div className="mt-3 overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-white/10 text-zinc-400">
                                  <th className="text-left py-2 px-2">Name</th>
                                  <th className="text-left py-2 px-2">Company</th>
                                  <th className="text-left py-2 px-2">Title</th>
                                  <th className="text-left py-2 px-2">Email</th>
                                  <th className="text-left py-2 px-2">Score</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leads.slice(0, 10).map((lead: Record<string, unknown>, i: number) => (
                                  <tr key={i} className="border-b border-white/5">
                                    <td className="py-2 px-2 font-medium">{String(lead.firstName)} {String(lead.lastName)}</td>
                                    <td className="py-2 px-2 text-zinc-400">{String(lead.company || "-")}</td>
                                    <td className="py-2 px-2 text-zinc-400">{String(lead.title || "-")}</td>
                                    <td className="py-2 px-2 text-emerald-400">{String(lead.email || "-")}</td>
                                    <td className="py-2 px-2">
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                                        (lead.confidence as number) > 0.8 ? "bg-emerald-500/20 text-emerald-400" :
                                        (lead.confidence as number) > 0.6 ? "bg-yellow-500/20 text-yellow-400" :
                                        "bg-red-500/20 text-red-400"
                                      }`}>
                                        {Math.round((lead.confidence as number) * 100)}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          );
                        })()}
                      </div>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-1.5 ml-2">
                          <button onClick={() => copyMessage(msg.content)} className="text-zinc-600 hover:text-zinc-400 transition p-1">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-zinc-600 hover:text-zinc-400 transition p-1">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-zinc-600 hover:text-zinc-400 transition p-1">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-white/10 text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-zinc-400 typing-dot" />
                        <div className="w-2 h-2 rounded-full bg-zinc-400 typing-dot" />
                        <div className="w-2 h-2 rounded-full bg-zinc-400 typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask me to find leads, verify emails, research companies..."
                  className="bg-white/5 border-white/10 pr-12 h-11 text-sm focus-visible:ring-blue-500/50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  size="icon"
                  className="absolute right-1 top-1 h-9 w-9 bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-2 text-center">
              KeeLead AI • Results are generated and may need verification •
              <a href="/dashboard" className="text-blue-500 hover:underline ml-1">Open Dashboard</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BarChart3(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
    </svg>
  )
}
