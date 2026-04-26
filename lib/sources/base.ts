// KeeLead — Base class for all data sources
import type { DataSource, Lead, CompanyData, ContactData, SearchOptions } from "./types"

export abstract class BaseSource implements DataSource {
  abstract name: string
  abstract id: string
  abstract category: string
  abstract requiresApiKey: boolean
  abstract rateLimit: number
  enabled = true

  abstract search(query: string, options?: SearchOptions): Promise<Lead[]>

  async getCompany?(domain: string): Promise<CompanyData | null>
  async getContact?(email: string): Promise<ContactData | null>

  protected makeLead(overrides: Partial<Lead>): Lead {
    return {
      firstName: "",
      lastName: "",
      source: this.name,
      confidence: 0.5,
      ...overrides,
    }
  }

  protected makeCompany(overrides: Partial<CompanyData>): CompanyData {
    return {
      name: "",
      ...overrides,
    }
  }

  protected async fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T | null> {
    try {
      const res = await fetch(url, { headers })
      if (!res.ok) return null
      return (await res.json()) as T
    } catch {
      return null
    }
  }

  protected randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  protected randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  protected generatePhone(): string {
    return `+1 (${this.randomInt(200, 999)}) ${this.randomInt(200, 999)}-${this.randomInt(1000, 9999)}`
  }

  protected generateDomain(company: string): string {
    return company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com"
  }
}
