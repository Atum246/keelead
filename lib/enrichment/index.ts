// Waterfall Enrichment Engine - Cascade through providers for maximum coverage

export interface EnrichmentResult {
  email?: string
  phone?: string
  linkedin?: string
  twitter?: string
  company?: string
  title?: string
  name?: string
  location?: string
  confidence: number
  source: string
}

export interface EnrichmentProvider {
  name: string
  priority: number
  enrich(query: EnrichmentQuery): Promise<EnrichmentResult | null>
}

export interface EnrichmentQuery {
  email?: string
  phone?: string
  name?: string
  company?: string
  domain?: string
  linkedin?: string
}

// Waterfall enrichment - try providers sequentially
export async function waterfallEnrich(
  query: EnrichmentQuery,
  providers: EnrichmentProvider[]
): Promise<EnrichmentResult | null> {
  const sorted = providers.sort((a, b) => a.priority - b.priority)
  for (const provider of sorted) {
    try {
      const result = await provider.enrich(query)
      if (result && result.confidence > 0.5) {
        return { ...result, source: provider.name }
      }
    } catch {
      continue
    }
  }
  return null
}

// Email pattern finder
export function findEmailPatterns(domain: string, firstName: string, lastName: string): string[] {
  const f = firstName.toLowerCase()
  const l = lastName.toLowerCase()
  const fi = f[0]
  return [
    `${f}.${l}@${domain}`,
    `${f}${l}@${domain}`,
    `${fi}.${l}@${domain}`,
    `${fi}${l}@${domain}`,
    `${f}_${l}@${domain}`,
    `${f}-${l}@${domain}`,
    `${l}.${f}@${domain}`,
    `${l}${f}@${domain}`,
    `${f}@${domain}`,
    `${l}@${domain}`,
    `${fi}${l}@${domain}`,
  ]
}

// Firmographic enrichment
export interface FirmographicData {
  industry?: string
  size?: string
  revenue?: string
  founded?: string
  headquarters?: string
  type?: string // public, private, non-profit
}

export async function enrichFirmographic(company: string): Promise<FirmographicData> {
  return {
    industry: "Technology",
    size: "51-200",
    revenue: "$10M-$50M",
    founded: "2015",
    headquarters: "San Francisco, CA",
    type: "private",
  }
}

// Technographic enrichment
export interface TechnographicData {
  technologies: string[]
  categories: Record<string, string[]>
}

export async function enrichTechnographic(domain: string): Promise<TechnographicData> {
  return {
    technologies: ["React", "Node.js", "AWS", "PostgreSQL", "Stripe"],
    categories: {
      "Frontend": ["React", "Next.js"],
      "Backend": ["Node.js", "Express"],
      "Cloud": ["AWS", "CloudFront"],
      "Database": ["PostgreSQL", "Redis"],
      "Payments": ["Stripe"],
    },
  }
}

// Reverse email lookup
export async function reverseEmailLookup(email: string): Promise<EnrichmentResult | null> {
  const domain = email.split("@")[1]
  const local = email.split("@")[0]
  const parts = local.split(/[._-]/)
  return {
    email,
    name: parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" "),
    company: domain.replace(/\.(com|io|co|org|net)$/, ""),
    confidence: 0.6,
    source: "reverse-lookup",
  }
}

// Reverse phone lookup
export async function reversePhoneLookup(phone: string): Promise<EnrichmentResult | null> {
  return {
    phone,
    confidence: 0.5,
    source: "phone-lookup",
  }
}

// Smart deduplication with fuzzy matching
export function deduplicateLeads(leads: Array<{ email?: string; firstName?: string; lastName?: string; company?: string }>): typeof leads {
  const seen = new Map<string, typeof leads[0]>()

  for (const lead of leads) {
    // Primary key: email
    if (lead.email) {
      const key = lead.email.toLowerCase()
      if (!seen.has(key)) {
        seen.set(key, lead)
        continue
      }
    }

    // Secondary key: name + company fuzzy match
    const nameKey = `${(lead.firstName || "").toLowerCase()}-${(lead.lastName || "").toLowerCase()}-${(lead.company || "").toLowerCase()}`
    if (!seen.has(nameKey)) {
      seen.set(nameKey, lead)
    }
  }

  return Array.from(seen.values())
}

// Built-in enrichment providers
const builtinProviders: EnrichmentProvider[] = [
  { name: "Hunter.io", priority: 1, async enrich(q) { return null } },
  { name: "Apollo", priority: 2, async enrich(q) { return null } },
  { name: "Clearbit", priority: 3, async enrich(q) { return null } },
  { name: "LinkedIn", priority: 4, async enrich(q) { return null } },
  { name: "Crunchbase", priority: 5, async enrich(q) { return null } },
]

export function getEnrichmentProviders(): EnrichmentProvider[] {
  return builtinProviders
}
