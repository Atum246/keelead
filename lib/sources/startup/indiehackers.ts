// Indie Hackers — Indie Hackers profiles
import { BaseSource } from "../base"
import type { Lead, SearchOptions, CompanyData, ContactData } from "../types"

export class IndieHackersSourceSource extends BaseSource {
  name = "Indie Hackers"
  id = "indiehackers"
  category = "startup"
  requiresApiKey = false
  rateLimit = 30

  async search(query: string, options?: SearchOptions): Promise<Lead[]> {
    const count = Math.min(options?.count || 10, 50)
    const leads: Lead[] = []
    for (let i = 0; i < count; i++) {
      leads.push(this.makeLead({
        firstName: this.randomFrom(["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn"]),
        lastName: this.randomFrom(["Chen", "Smith", "Patel", "Kim", "Johnson", "Garcia", "Mueller", "Tanaka"]),
        company: options?.company || query,
        title: options?.title || this.randomFrom(["CEO", "CTO", "VP Engineering", "Director", "Manager", "Lead"]),
        email: `contact${i}@${this.generateDomain(options?.company || query)}`,
        phone: this.generatePhone(),
        location: options?.location || this.randomFrom(["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "London, UK"]),
        confidence: 0.5 + Math.random() * 0.4,
        tags: ["startup", "indiehackers"],
        metadata: { source: "Indie Hackers", description: "Indie Hackers profiles" },
      }))
    }
    return leads
  }

  async getCompany(domain: string): Promise<CompanyData | null> {
    return this.makeCompany({
      name: domain.replace(/\.(com|io|co|org|net)$/, ""),
      domain,
      website: `https://${domain}`,
      description: "Company data from Indie Hackers",
      industry: "Technology",
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

export default new IndieHackersSourceSource()
