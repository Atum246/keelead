// AI Provider Abstraction Layer
export interface AIProvider {
  name: string
  chat(messages: Message[], options?: ChatOptions): Promise<string>
  stream?(messages: Message[], options?: ChatOptions): AsyncGenerator<string>
}

export interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  functions?: FunctionDefinition[]
}

export interface FunctionDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
}

// OpenAI Provider
export class OpenAIProvider implements AIProvider {
  name = "openai"
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl || "https://api.openai.com/v1"
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || "gpt-4o-mini",
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
      }),
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ""
  }

  async *stream(messages: Message[], options?: ChatOptions): AsyncGenerator<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || "gpt-4o-mini",
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        stream: true,
      }),
    })
    const reader = response.body?.getReader()
    if (!reader) return
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "))
      for (const line of lines) {
        const data = line.slice(6)
        if (data === "[DONE]") return
        try {
          const json = JSON.parse(data)
          const content = json.choices?.[0]?.delta?.content
          if (content) yield content
        } catch {}
      }
    }
  }
}

// Anthropic Provider
export class AnthropicProvider implements AIProvider {
  name = "anthropic"
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const systemMsg = messages.find((m) => m.role === "system")
    const chatMessages = messages.filter((m) => m.role !== "system")
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options?.model || "claude-3-5-sonnet-20241022",
        max_tokens: options?.maxTokens || 4096,
        system: systemMsg?.content,
        messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })
    const data = await response.json()
    return data.content?.[0]?.text || ""
  }
}

// OpenRouter Provider
export class OpenRouterProvider implements AIProvider {
  name = "openrouter"
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://keelead.dev",
        "X-Title": "KeeLead",
      },
      body: JSON.stringify({
        model: options?.model || "openai/gpt-4o-mini",
        messages,
        temperature: options?.temperature ?? 0.7,
      }),
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ""
  }
}

// NVIDIA NIM Provider
export class NVIDIAProvider implements AIProvider {
  name = "nvidia"
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || "meta/llama-3.1-8b-instruct",
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens || 1024,
      }),
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ""
  }
}

// Ollama Provider (Local)
export class OllamaProvider implements AIProvider {
  name = "ollama"
  private baseUrl: string

  constructor(baseUrl: string = "http://localhost:11434") {
    this.baseUrl = baseUrl
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options?.model || "llama3.1",
        messages,
        stream: false,
      }),
    })
    const data = await response.json()
    return data.message?.content || ""
  }
}

// Custom Provider
export class CustomProvider implements AIProvider {
  name = "custom"
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor(apiKey: string, baseUrl: string, model: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    this.model = model
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
      }),
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ""
  }
}

// Provider Factory
export function createProvider(config: ProviderConfig): AIProvider {
  switch (config.provider) {
    case "openai":
      return new OpenAIProvider(config.apiKey!, config.baseUrl)
    case "anthropic":
      return new AnthropicProvider(config.apiKey!)
    case "openrouter":
      return new OpenRouterProvider(config.apiKey!)
    case "nvidia":
      return new NVIDIAProvider(config.apiKey!)
    case "ollama":
      return new OllamaProvider(config.baseUrl)
    case "custom":
      return new CustomProvider(config.apiKey!, config.baseUrl!, config.model!)
    default:
      throw new Error(`Unknown provider: ${config.provider}`)
  }
}

export interface ProviderConfig {
  provider: string
  apiKey?: string
  baseUrl?: string
  model?: string
}

// Default system prompt for lead generation
export const LEAD_GEN_SYSTEM_PROMPT = `You are KeeLead, an advanced AI-powered lead generation assistant. You help users find, research, and manage business leads.

Your capabilities:
1. **Lead Search**: Find leads by name, company, title, location, industry, and more
2. **Company Research**: Deep dive into companies - overview, tech stack, key people, funding, competitors
3. **Email Verification**: Verify email addresses with multi-layer validation
4. **Contact Finding**: Find contact information for specific people
5. **Data Export**: Export leads in various formats (CSV, JSON, Excel, vCard)

When processing queries:
- Parse the user's intent (search, research, verify, export)
- Extract key parameters (names, locations, industries, job titles)
- Provide structured results in tables or cards
- Include confidence scores when available
- Suggest follow-up actions

Always be helpful, precise, and action-oriented. Format results clearly with markdown tables and lists.`

// Helper: parse lead generation intent from natural language
export function parseLeadIntent(query: string): LeadIntent {
  const lower = query.toLowerCase()
  
  let intent: LeadIntent["type"] = "search"
  if (lower.includes("research") || lower.includes("tell me about")) intent = "research"
  if (lower.includes("verify") || lower.includes("check email")) intent = "verify"
  if (lower.includes("export") || lower.includes("download")) intent = "export"
  if (lower.includes("find") || lower.includes("search") || lower.includes("get")) intent = "search"

  const params: Record<string, string> = {}
  
  // Extract location
  const locationPatterns = [
    /(?:in|from|near|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /([A-Z][a-z]+(?:,\s*[A-Z]{2})?)/,
  ]
  for (const pattern of locationPatterns) {
    const match = query.match(pattern)
    if (match) { params.location = match[1]; break }
  }

  // Extract count
  const countMatch = query.match(/(\d+)\s*(?:leads?|contacts?|people|results?|founders?)/i)
  if (countMatch) params.count = countMatch[1]

  // Extract company
  const companyMatch = query.match(/(?:at|from|of|company)\s+([A-Z][A-Za-z0-9]+)/)
  if (companyMatch) params.company = companyMatch[1]

  // Extract title/role
  const titlePatterns = [
    /(?:founders?|ceos?|ctos?|vp|directors?|managers?|engineers?|developers?)/i,
  ]
  for (const pattern of titlePatterns) {
    const match = query.match(pattern)
    if (match) { params.title = match[0]; break }
  }

  // Extract industry
  const industries = ["saas", "fintech", "healthcare", "ecommerce", "tech", "startup", "restaurant", "retail"]
  for (const ind of industries) {
    if (lower.includes(ind)) { params.industry = ind; break }
  }

  return { type: intent, query, params }
}

export interface LeadIntent {
  type: "search" | "research" | "verify" | "export"
  query: string
  params: Record<string, string>
}
