/**
 * KeeLead RAG / Knowledge Base
 * 
 * Vector-based knowledge base for lead intelligence.
 * Stores and retrieves lead data, company profiles, and research
 * using semantic search.
 * 
 * Works with any vector store: Pinecone, Weaviate, Chroma, Qdrant,
 * or in-memory for development.
 */

export interface KnowledgeEntry {
  id: string
  content: string
  metadata: {
    type: "lead" | "company" | "research" | "signal" | "email_pattern"
    source: string
    timestamp: Date
    [key: string]: unknown
  }
  embedding?: number[]
}

export interface SearchResult {
  entry: KnowledgeEntry
  score: number
}

// In-memory vector store (for development; swap with Pinecone/Weaviate/Chroma in production)
class InMemoryVectorStore {
  private entries: KnowledgeEntry[] = []

  async add(entry: KnowledgeEntry): Promise<void> {
    this.entries.push(entry)
  }

  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    // Simple keyword-based search (replace with embedding similarity in production)
    const queryLower = query.toLowerCase()
    const results: SearchResult[] = []

    for (const entry of this.entries) {
      const contentLower = entry.content.toLowerCase()
      let score = 0

      // Exact match bonus
      if (contentLower.includes(queryLower)) score += 10

      // Keyword matching
      const keywords = queryLower.split(/\s+/)
      for (const keyword of keywords) {
        if (contentLower.includes(keyword)) score += 2
      }

      // Metadata matching
      for (const [key, value] of Object.entries(entry.metadata)) {
        if (typeof value === "string" && value.toLowerCase().includes(queryLower)) {
          score += 5
        }
      }

      if (score > 0) {
        results.push({ entry, score })
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  async get(id: string): Promise<KnowledgeEntry | null> {
    return this.entries.find((e) => e.id === id) || null
  }

  async delete(id: string): Promise<void> {
    this.entries = this.entries.filter((e) => e.id !== id)
  }

  async count(): Promise<number> {
    return this.entries.length
  }
}

// Knowledge Base Manager
export class KnowledgeBase {
  private store: InMemoryVectorStore

  constructor() {
    this.store = new InMemoryVectorStore()
  }

  // Index a lead
  async indexLead(lead: {
    id: string
    firstName: string
    lastName: string
    email?: string
    company?: string
    title?: string
    location?: string
    tags?: string[]
  }): Promise<void> {
    const content = [
      `${lead.firstName} ${lead.lastName}`,
      lead.title && `Title: ${lead.title}`,
      lead.company && `Company: ${lead.company}`,
      lead.email && `Email: ${lead.email}`,
      lead.location && `Location: ${lead.location}`,
      lead.tags && `Tags: ${lead.tags.join(", ")}`,
    ].filter(Boolean).join("\n")

    await this.store.add({
      id: `lead:${lead.id}`,
      content,
      metadata: {
        type: "lead",
        source: "keelead",
        timestamp: new Date(),
        leadId: lead.id,
        company: lead.company,
        title: lead.title,
      },
    })
  }

  // Index a company profile
  async indexCompany(profile: {
    name: string
    industry?: string
    description?: string
    techStack?: string[]
    keyPeople?: Array<{ name: string; title: string }>
  }): Promise<void> {
    const content = [
      profile.name,
      profile.industry && `Industry: ${profile.industry}`,
      profile.description,
      profile.techStack && `Tech: ${profile.techStack.join(", ")}`,
      profile.keyPeople && `People: ${profile.keyPeople.map((p) => `${p.name} (${p.title})`).join(", ")}`,
    ].filter(Boolean).join("\n")

    await this.store.add({
      id: `company:${profile.name.toLowerCase().replace(/\s+/g, "-")}`,
      content,
      metadata: {
        type: "company",
        source: "keelead",
        timestamp: new Date(),
        companyName: profile.name,
        industry: profile.industry,
      },
    })
  }

  // Index research notes
  async indexResearch(id: string, content: string, metadata: Record<string, unknown>): Promise<void> {
    await this.store.add({
      id: `research:${id}`,
      content,
      metadata: {
        type: "research",
        source: "keelead",
        timestamp: new Date(),
        ...metadata,
      },
    })
  }

  // Semantic search
  async search(query: string, options?: {
    type?: string
    limit?: number
  }): Promise<SearchResult[]> {
    let results = await this.store.search(query, options?.limit || 10)
    if (options?.type) {
      results = results.filter((r) => r.entry.metadata.type === options.type)
    }
    return results
  }

  // Get context for AI agents
  async getContext(query: string, maxEntries: number = 5): Promise<string> {
    const results = await this.search(query, { limit: maxEntries })
    if (results.length === 0) return "No relevant context found."

    return results
      .map((r) => `[${r.entry.metadata.type.toUpperCase()}] ${r.entry.content}`)
      .join("\n\n---\n\n")
  }

  // Stats
  async stats(): Promise<{ total: number; byType: Record<string, number> }> {
    const total = await this.store.count()
    return { total, byType: {} }
  }
}

// Singleton instance
export const knowledgeBase = new KnowledgeBase()
