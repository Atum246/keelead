// KeeLead — AI Agent-friendly API wrapper
import { sourceManager, type Lead, type CompanyData, type ContactData } from "../sources"
import { verifyEmail } from "../email"
import { researchCompany } from "../research"
import { waterfallEnrich, findEmailPatterns } from "../enrichment"

export interface AgentSearchOptions {
  query: string
  count?: number
  location?: string
  industry?: string
  title?: string
  company?: string
  sources?: string[]
}

export interface AgentVerifyOptions {
  email?: string
  emails?: string[]
}

export interface AgentResearchOptions {
  query: string
}

export interface AgentEnrichOptions {
  email?: string
  name?: string
  company?: string
  domain?: string
}

export interface AgentContactOptions {
  name?: string
  company?: string
  title?: string
  location?: string
  email?: string
}

export class KeeLeadAgent {
  /** Search for leads with natural language */
  async searchLeads(options: AgentSearchOptions): Promise<{
    leads: Lead[]
    total: number
    sources: string[]
    query: string
  }> {
    const searchOptions = {
      count: options.count || 25,
      location: options.location,
      industry: options.industry,
      title: options.title,
      company: options.company,
    }

    let leads: Lead[]
    if (options.sources?.length) {
      leads = await sourceManager.searchSources(options.sources, options.query, searchOptions)
    } else {
      leads = await sourceManager.searchAll(options.query, searchOptions)
    }

    return {
      leads: leads.slice(0, options.count || 25),
      total: leads.length,
      sources: sourceManager.getEnabled().map((s) => s.name),
      query: options.query,
    }
  }

  /** Verify one or more email addresses */
  async verifyEmails(options: AgentVerifyOptions) {
    const emails = options.emails || (options.email ? [options.email] : [])
    if (emails.length === 0) throw new Error("No email provided")

    const results = []
    for (const email of emails) {
      results.push(await verifyEmail(email))
    }
    return results.length === 1 ? results[0] : results
  }

  /** Deep research on a company */
  async researchCompany(options: AgentResearchOptions) {
    return researchCompany(options.query)
  }

  /** Find contact information */
  async findContact(options: AgentContactOptions): Promise<ContactData | null> {
    if (options.email) {
      return sourceManager.findContact(options.email)
    }
    // Search for the contact
    const query = [options.name, options.company, options.title, options.location]
      .filter(Boolean)
      .join(" ")
    const leads = await sourceManager.searchAll(query, { count: 5 })
    if (leads.length === 0) return null

    const best = leads[0]
    return {
      name: `${best.firstName} ${best.lastName}`.trim(),
      email: best.email,
      phone: best.phone,
      title: best.title,
      company: best.company,
      linkedin: best.linkedin,
      location: best.location,
      confidence: best.confidence,
      source: best.source,
    }
  }

  /** Enrich a lead with more data */
  async enrichLead(options: AgentEnrichOptions) {
    const results: Record<string, unknown> = {}

    if (options.email) {
      const domain = options.email.split("@")[1]
      const contact = await sourceManager.findContact(options.email)
      if (contact) results.contact = contact
      results.patterns = findEmailPatterns(domain, options.name || "Unknown", "")
    }

    if (options.domain || options.company) {
      const domain = options.domain || this.companyToDomain(options.company || "")
      const company = await sourceManager.researchCompany(domain)
      if (company) results.company = company
    }

    return results
  }

  /** Get email patterns for a domain */
  getEmailPatterns(domain: string, firstName: string, lastName: string) {
    return findEmailPatterns(domain, firstName, lastName)
  }

  /** List available data sources */
  listSources() {
    return sourceManager.getAll().map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      enabled: s.enabled,
      requiresApiKey: s.requiresApiKey,
      rateLimit: s.rateLimit,
    }))
  }

  /** Get source stats */
  getStats() {
    return sourceManager.getStats()
  }

  /** Enable/disable a source */
  setSourceEnabled(id: string, enabled: boolean) {
    sourceManager.setEnabled(id, enabled)
  }

  /** Score a lead against an ICP */
  scoreLead(lead: Partial<Lead>, icp?: {
    titles?: string[]
    industries?: string[]
    locations?: string[]
    companySize?: string[]
  }): number {
    let score = 50 // base score

    if (icp?.titles && lead.title) {
      const match = icp.titles.some((t) =>
        lead.title!.toLowerCase().includes(t.toLowerCase())
      )
      score += match ? 20 : -10
    }

    if (icp?.industries && lead.company) {
      const match = icp.industries.some((i) =>
        lead.company!.toLowerCase().includes(i.toLowerCase())
      )
      score += match ? 15 : -5
    }

    if (icp?.locations && lead.location) {
      const match = icp.locations.some((l) =>
        lead.location!.toLowerCase().includes(l.toLowerCase())
      )
      score += match ? 10 : -5
    }

    if (lead.email) score += 5
    if (lead.phone) score += 5
    if (lead.linkedin) score += 5

    return Math.max(0, Math.min(100, score))
  }

  private companyToDomain(company: string): string {
    return company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com"
  }
}

export const keeleadAgent = new KeeLeadAgent()
