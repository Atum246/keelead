// Intent Signals Engine - Track job changes, news, hiring, social mentions

export interface Signal {
  id: string
  type: "job_change" | "news" | "hiring" | "social" | "funding" | "product"
  title: string
  description: string
  company: string
  person?: string
  date: Date
  score: number
  source: string
  actionable: boolean
  metadata?: Record<string, unknown>
}

export interface SignalConfig {
  enabledTypes: string[]
  minScore: number
  sources: string[]
  watchList: string[] // companies/people to watch
}

// Signal detection engines
export class JobChangeDetector {
  async detect(company: string): Promise<Signal[]> {
    // Simulate job change detection
    return [{
      id: Math.random().toString(36).substring(7),
      type: "job_change",
      title: `New hire at ${company}`,
      description: `Key position filled at ${company}`,
      company,
      date: new Date(),
      score: 85,
      source: "LinkedIn",
      actionable: true,
    }]
  }
}

export class NewsTracker {
  async track(company: string): Promise<Signal[]> {
    return [{
      id: Math.random().toString(36).substring(7),
      type: "news",
      title: `${company} in the news`,
      description: `Recent news mention for ${company}`,
      company,
      date: new Date(),
      score: 70,
      source: "News",
      actionable: false,
    }]
  }
}

export class HiringSignalDetector {
  async detect(company: string): Promise<Signal[]> {
    return [{
      id: Math.random().toString(36).substring(7),
      type: "hiring",
      title: `${company} is hiring`,
      description: `New job postings detected for ${company}`,
      company,
      date: new Date(),
      score: 80,
      source: "Job Boards",
      actionable: true,
    }]
  }
}

export class SocialMentionTracker {
  async track(query: string): Promise<Signal[]> {
    return [{
      id: Math.random().toString(36).substring(7),
      type: "social",
      title: `Social mention: ${query}`,
      description: `Mentioned on social media`,
      company: query,
      date: new Date(),
      score: 65,
      source: "Twitter/X",
      actionable: false,
    }]
  }
}

export class FundingDetector {
  async detect(company: string): Promise<Signal[]> {
    return [{
      id: Math.random().toString(36).substring(7),
      type: "funding",
      title: `${company} funding event`,
      description: `Potential funding activity detected`,
      company,
      date: new Date(),
      score: 90,
      source: "Crunchbase",
      actionable: true,
    }]
  }
}

// AI Lead Scoring
export function calculateLeadScore(
  lead: { title?: string; company?: string; industry?: string; location?: string },
  icp: IdealCustomerProfile,
  signals: Signal[]
): number {
  let score = 50 // base

  // Title match
  if (lead.title && icp.titles.some((t) => lead.title!.toLowerCase().includes(t.toLowerCase()))) {
    score += 15
  }

  // Industry match
  if (lead.industry && icp.industries.includes(lead.industry)) {
    score += 10
  }

  // Location match
  if (lead.location && icp.locations.some((l) => lead.location!.toLowerCase().includes(l.toLowerCase()))) {
    score += 5
  }

  // Company size match
  if (lead.company) {
    score += 5
  }

  // Signal boost
  const relevantSignals = signals.filter((s) => s.company === lead.company)
  const signalBoost = Math.min(relevantSignals.reduce((a, s) => a + s.score * 0.1, 0), 20)
  score += signalBoost

  return Math.min(Math.round(score), 100)
}

export interface IdealCustomerProfile {
  titles: string[]
  industries: string[]
  locations: string[]
  companySize: { min: number; max: number }
  technologies: string[]
  keywords: string[]
}

// Buying Committee mapping
export interface BuyingCommittee {
  decisionMakers: string[] // CEO, CFO, VP
  influencers: string[] // Directors, Managers
  champions: string[] // Internal advocates
  blockers: string[] // Potential blockers
  gatekeepers: string[] // Admins, Assistants
}

export function mapBuyingCommittee(people: Array<{ title: string }>): BuyingCommittee {
  const committee: BuyingCommittee = {
    decisionMakers: [],
    influencers: [],
    champions: [],
    blockers: [],
    gatekeepers: [],
  }

  for (const person of people) {
    const title = person.title.toLowerCase()
    if (title.includes("ceo") || title.includes("cfo") || title.includes("cto") || title.includes("vp") || title.includes("president")) {
      committee.decisionMakers.push(person.title)
    } else if (title.includes("director") || title.includes("head of") || title.includes("manager")) {
      committee.influencers.push(person.title)
    } else if (title.includes("lead") || title.includes("senior") || title.includes("principal")) {
      committee.champions.push(person.title)
    } else if (title.includes("assistant") || title.includes("coordinator") || title.includes("admin")) {
      committee.gatekeepers.push(person.title)
    }
  }

  return committee
}
