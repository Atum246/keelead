"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Settings, Key, Globe, Bell, Palette, Plug, Shield,
  Brain, Server, Check, X, ExternalLink, Copy, Eye, EyeOff,
  Webhook, Scale, Terminal
} from "lucide-react"

interface AIProviderConfig {
  id: string
  name: string
  icon: string
  enabled: boolean
  apiKey: string
  baseUrl: string
  model: string
  configured: boolean
}

export default function SettingsPage() {
  const [providers, setProviders] = useState<AIProviderConfig[]>([
    { id: "openai", name: "OpenAI (ChatGPT)", icon: "🤖", enabled: true, apiKey: "", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", configured: false },
    { id: "anthropic", name: "Anthropic (Claude)", icon: "🧠", enabled: false, apiKey: "", baseUrl: "https://api.anthropic.com", model: "claude-3-5-sonnet-20241022", configured: false },
    { id: "openrouter", name: "OpenRouter", icon: "🔀", enabled: false, apiKey: "", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini", configured: false },
    { id: "nvidia", name: "NVIDIA NIM", icon: "💚", enabled: false, apiKey: "", baseUrl: "https://integrate.api.nvidia.com/v1", model: "meta/llama-3.1-8b-instruct", configured: false },
    { id: "ollama", name: "Ollama (Local)", icon: "🦙", enabled: false, apiKey: "", baseUrl: "http://localhost:11434", model: "llama3.1", configured: false },
    { id: "custom", name: "Custom Provider", icon: "⚙️", enabled: false, apiKey: "", baseUrl: "", model: "", configured: false },
  ])

  const [defaultProvider, setDefaultProvider] = useState("openai")
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState({
    email: true, browser: true, slack: false, discord: false,
  })
  const [proxy, setProxy] = useState({ enabled: false, url: "", rotation: false })

  const toggleKeyVisibility = (id: string) => {
    const next = new Set(showKeys)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setShowKeys(next)
  }

  const updateProvider = (id: string, updates: Partial<AIProviderConfig>) => {
    setProviders((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p))
  }

  const dataSources = [
    { name: "Web Search", enabled: true, category: "search" },
    { name: "LinkedIn", enabled: true, category: "professional" },
    { name: "Company Websites", enabled: true, category: "corporate" },
    { name: "Crunchbase", enabled: true, category: "startup" },
    { name: "GitHub", enabled: true, category: "developer" },
    { name: "Google Maps", enabled: true, category: "local" },
    { name: "Yelp", enabled: true, category: "local" },
    { name: "Yellow Pages", enabled: true, category: "directory" },
    { name: "Hunter.io", enabled: true, category: "email" },
    { name: "Twitter/X", enabled: true, category: "social" },
    { name: "AngelList", enabled: true, category: "startup" },
    { name: "Product Hunt", enabled: true, category: "startup" },
    { name: "Reddit", enabled: false, category: "social" },
    { name: "SEC EDGAR", enabled: true, category: "financial" },
    { name: "WHOIS", enabled: true, category: "domain" },
    { name: "Glassdoor", enabled: false, category: "employment" },
    { name: "Job Boards", enabled: true, category: "employment" },
    { name: "Patent DBs", enabled: false, category: "intellectual-property" },
    { name: "Google Scholar", enabled: false, category: "academic" },
    { name: "Conferences", enabled: false, category: "events" },
    { name: "Podcasts", enabled: false, category: "media" },
    { name: "Government Registries", enabled: false, category: "government" },
    { name: "Chamber of Commerce", enabled: false, category: "local" },
    { name: "DNS/SSL Data", enabled: true, category: "technical" },
    { name: "App Stores", enabled: false, category: "mobile" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Configure AI providers, data sources, notifications, and more.</p>
      </div>

      <Tabs defaultValue="ai" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="ai" className="data-[state=active]:bg-white/10">
            <Brain className="w-4 h-4 mr-2" /> AI Models
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-white/10">
            <Globe className="w-4 h-4 mr-2" /> Data Sources
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="proxy" className="data-[state=active]:bg-white/10">
            <Server className="w-4 h-4 mr-2" /> Proxy
          </TabsTrigger>
          <TabsTrigger value="plugins" className="data-[state=active]:bg-white/10">
            <Plug className="w-4 h-4 mr-2" /> Plugins
          </TabsTrigger>
          <TabsTrigger value="mcp" className="data-[state=active]:bg-white/10">
            <Terminal className="w-4 h-4 mr-2" /> MCP Server
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-white/10">
            <Webhook className="w-4 h-4 mr-2" /> Webhooks
          </TabsTrigger>
          <TabsTrigger value="weights" className="data-[state=active]:bg-white/10">
            <Scale className="w-4 h-4 mr-2" /> Source Weights
          </TabsTrigger>
        </TabsList>

        {/* AI Models */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">AI Provider Configuration</CardTitle>
              <CardDescription>Configure your AI providers. Add API keys to enable each provider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-xs text-zinc-400">Model: {provider.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {defaultProvider === provider.id && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">Default</Badge>
                      )}
                      <Switch
                        checked={provider.enabled}
                        onCheckedChange={(checked) => updateProvider(provider.id, { enabled: checked })}
                      />
                    </div>
                  </div>
                  {provider.enabled && (
                    <div className="space-y-3 mt-3 pt-3 border-t border-white/10">
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">API Key</label>
                        <div className="relative">
                          <Input
                            type={showKeys.has(provider.id) ? "text" : "password"}
                            value={provider.apiKey}
                            onChange={(e) => updateProvider(provider.id, { apiKey: e.target.value })}
                            placeholder={`Enter ${provider.name} API key`}
                            className="bg-white/5 border-white/10 pr-20"
                          />
                          <div className="absolute right-1 top-1 flex gap-1">
                            <button onClick={() => toggleKeyVisibility(provider.id)} className="p-1.5 text-zinc-400 hover:text-white">
                              {showKeys.has(provider.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      {provider.id === "ollama" || provider.id === "custom" ? (
                        <div>
                          <label className="text-xs text-zinc-400 mb-1 block">Base URL</label>
                          <Input
                            value={provider.baseUrl}
                            onChange={(e) => updateProvider(provider.id, { baseUrl: e.target.value })}
                            placeholder="http://localhost:11434"
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      ) : null}
                      {provider.id === "custom" && (
                        <div>
                          <label className="text-xs text-zinc-400 mb-1 block">Model Name</label>
                          <Input
                            value={provider.model}
                            onChange={(e) => updateProvider(provider.id, { model: e.target.value })}
                            placeholder="e.g., gpt-4"
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => { updateProvider(provider.id, { configured: true }); setDefaultProvider(provider.id) }}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Save & Set Default
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/10">
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Sources */}
        <TabsContent value="sources">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Data Sources</CardTitle>
              <CardDescription>Enable or disable individual data sources for lead generation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dataSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm font-medium">{source.name}</p>
                      <p className="text-xs text-zinc-400 capitalize">{source.category}</p>
                    </div>
                    <Switch defaultChecked={source.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email", label: "Email Notifications", desc: "Receive email alerts for new leads and campaigns" },
                { key: "browser", label: "Browser Notifications", desc: "Push notifications in your browser" },
                { key: "slack", label: "Slack", desc: "Send notifications to a Slack channel" },
                { key: "discord", label: "Discord", desc: "Send notifications to a Discord channel" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                  />
                </div>
              ))}
              {(notifications.slack || notifications.discord) && (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                  <Input placeholder="https://hooks.slack.com/..." className="bg-white/5 border-white/10" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proxy */}
        <TabsContent value="proxy">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Proxy Configuration</CardTitle>
              <CardDescription>Configure proxy settings for web scraping and data collection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium">Enable Proxy</p>
                  <p className="text-sm text-zinc-400">Route requests through a proxy server</p>
                </div>
                <Switch
                  checked={proxy.enabled}
                  onCheckedChange={(checked) => setProxy((prev) => ({ ...prev, enabled: checked }))}
                />
              </div>
              {proxy.enabled && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Proxy URL</label>
                    <Input
                      value={proxy.url}
                      onChange={(e) => setProxy((prev) => ({ ...prev, url: e.target.value }))}
                      placeholder="http://user:pass@proxy.example.com:8080"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium">Proxy Rotation</p>
                      <p className="text-sm text-zinc-400">Automatically rotate between multiple proxies</p>
                    </div>
                    <Switch
                      checked={proxy.rotation}
                      onCheckedChange={(checked) => setProxy((prev) => ({ ...prev, rotation: checked }))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plugins */}
        <TabsContent value="plugins">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Plugin Manager</CardTitle>
              <CardDescription>Install and manage KeeLead plugins and integrations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Telegram Bot", desc: "Chat with KeeLead via Telegram", installed: true, enabled: true },
                  { name: "WhatsApp Bot", desc: "Chat with KeeLead via WhatsApp", installed: false, enabled: false },
                  { name: "Slack Integration", desc: "Send leads to Slack channels", installed: true, enabled: false },
                  { name: "Discord Bot", desc: "Lead alerts in Discord", installed: true, enabled: true },
                  { name: "HubSpot CRM", desc: "Sync leads with HubSpot", installed: false, enabled: false },
                  { name: "Salesforce", desc: "Sync leads with Salesforce", installed: false, enabled: false },
                  { name: "Google Sheets", desc: "Export to Google Sheets", installed: true, enabled: true },
                  { name: "Zapier", desc: "Connect with 5000+ apps", installed: false, enabled: false },
                ].map((plugin) => (
                  <div key={plugin.name} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{plugin.name}</h3>
                      <Switch defaultChecked={plugin.enabled} />
                    </div>
                    <p className="text-xs text-zinc-400 mb-3">{plugin.desc}</p>
                    <Badge variant="outline" className={`text-xs ${plugin.installed ? "border-emerald-500/30 text-emerald-400" : "border-white/10 text-zinc-400"}`}>
                      {plugin.installed ? "Installed" : "Not Installed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MCP Server */}
        <TabsContent value="mcp">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">MCP Server Configuration</CardTitle>
              <CardDescription>Model Context Protocol server for AI agent integration. Exposes 10 tools, 5 resources, 4 prompts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">MCP Server Status</h3>
                    <p className="text-xs text-zinc-400">stdio transport • 57 data sources</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Ready</Badge>
                </div>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-zinc-300">
                  <p className="text-zinc-400 mb-1"># Start MCP server:</p>
                  <p className="text-emerald-400">npx tsx mcp/server.ts</p>
                  <p className="text-zinc-400 mt-2 mb-1"># Or with npm script:</p>
                  <p className="text-emerald-400">npm run mcp</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">OpenClaw Config</h3>
                <pre className="bg-black/50 rounded-lg p-3 text-xs font-mono text-blue-400 overflow-x-auto">{`{
  "mcpServers": {
    "keelead": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"],
      "env": { "KEELEAD_API_URL": "http://localhost:3000" }
    }
  }
}`}</pre>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { tool: "keelead_search_leads", desc: "Search 57 sources" },
                  { tool: "keelead_verify_email", desc: "10-layer verification" },
                  { tool: "keelead_research_company", desc: "Deep company research" },
                  { tool: "keelead_find_contact", desc: "Find contacts" },
                  { tool: "keelead_enrich_lead", desc: "Enrich with more data" },
                  { tool: "keelead_export_leads", desc: "Export to CSV/JSON/Excel" },
                  { tool: "keelead_get_signals", desc: "Intent signals" },
                  { tool: "keelead_email_pattern", desc: "Email patterns" },
                  { tool: "keelead_list_sources", desc: "List 57 sources" },
                  { tool: "keelead_lead_score", desc: "AI lead scoring" },
                ].map((t) => (
                  <div key={t.tool} className="p-2 rounded bg-black/30 border border-white/5">
                    <p className="text-xs font-mono text-emerald-400">{t.tool}</p>
                    <p className="text-xs text-zinc-500">{t.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Webhook Management</CardTitle>
              <CardDescription>Configure webhook endpoints to receive real-time event notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">+ Add Webhook</Button>
              </div>
              {[
                { url: "https://hooks.slack.com/services/xxx", events: ["lead.created", "email.verified"], enabled: true },
                { url: "https://hooks.zapier.com/hooks/xxx", events: ["*"], enabled: false },
              ].map((wh, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-xs font-mono text-zinc-300">{wh.url}</code>
                    <Switch defaultChecked={wh.enabled} />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {wh.events.map((e) => (
                      <Badge key={e} variant="outline" className="text-xs border-white/10 font-mono">{e}</Badge>
                    ))}
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">Available Events</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "lead.created", "lead.updated", "lead.enriched", "lead.scored",
                    "email.verified", "email.sent", "email.opened", "email.clicked",
                    "campaign.started", "campaign.completed", "signal.detected",
                    "export.completed", "batch.completed",
                  ].map((e) => (
                    <Badge key={e} variant="outline" className="text-xs border-white/10 font-mono justify-start">{e}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Source Weights */}
        <TabsContent value="weights">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Data Source Priority & Weights</CardTitle>
              <CardDescription>Adjust the weight of each data source to influence result ranking. Higher weight = higher priority.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "LinkedIn", category: "professional", weight: 1.5 },
                  { name: "Crunchbase", category: "startup", weight: 1.3 },
                  { name: "GitHub", category: "social", weight: 1.2 },
                  { name: "Google Maps", category: "local", weight: 1.0 },
                  { name: "Hunter.io", category: "email", weight: 1.4 },
                  { name: "SEC EDGAR", category: "company", weight: 1.1 },
                  { name: "Companies House", category: "company", weight: 1.0 },
                  { name: "Google Scholar", category: "education", weight: 0.8 },
                  { name: "Product Hunt", category: "startup", weight: 1.0 },
                  { name: "Stack Overflow", category: "developer", weight: 0.9 },
                ].map((source) => (
                  <div key={source.name} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{source.name}</p>
                      <p className="text-xs text-zinc-400 capitalize">{source.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 w-8 text-right">{source.weight.toFixed(1)}x</span>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        defaultValue={source.weight}
                        className="w-24 accent-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
