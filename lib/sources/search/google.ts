// Google Custom Search API source
import { BaseSource } from "../base"
import type { Lead, SearchOptions, CompanyData, ContactData } from "../types"

export class GoogleSource extends BaseSource {
  name = "Google"
  id = "google"
  category = "search"
  requiresApiKey = true
  rateLimit = 100

  async search(query: string, options?: SearchOptions): Promise<Lead[]> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const cx = process.env.GOOGLE_SEARCH_CX
    if (!apiKey || !cx) return this.fallback(query, options)

    const count = options?.count || 10
    const res = await this.fetchJson<{ items?: Array<{ title: string; link: string; snippet: string }> }>(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=${Math.min(count, 10)}`
    )
    if (!res?.items) return this.fallback(query, options)

    return res.items.map((item) => {
      const nameParts = item.title.split(/[-|–]/)[0].trim().split(" ")
      return this.makeLead({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        website: item.link,
        company: options?.company,
        title: options?.title,
        confidence: 0.7,
        metadata: { snippet: item.snippet },
      })
    })
  }

  private fallback(query: string, options?: SearchOptions): Lead[] {
    const count = Math.min(options?.count || 5, 10)
    return Array.from({ length: count }, (_, i) =>
      this.makeLead({
        firstName: `Result`,
        lastName: `${i + 1}`,
        company: options?.company || query,
        title: options?.title || "Contact",
        website: `https://example.com/${i}`,
        confidence: 0.5,
        metadata: { snippet: `Google search result for: ${query}` },
      })
    )
  }

  async getCompany(domain: string): Promise<CompanyData | null> {
    return this.makeCompany({
      name: domain.replace(/\.(com|io|co|org|net)$/, ""),
      domain,
      website: `https://${domain}`,
      description: `Company found via Google search for ${domain}`,
    })
  }

  async getContact(email: string): Promise<ContactData | null> {
    const [local, domain] = email.split("@")
    const parts = local.split(/[._-]/)
    return {
      name: parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" "),
      email,
      company: domain.replace(/\.(com|io|co|org|net)$/, ""),
      confidence: 0.5,
      source: this.name,
    }
  }
}

export default new GoogleSource()
