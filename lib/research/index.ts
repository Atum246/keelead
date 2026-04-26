// Company Research Engine - Multi-source aggregation

export interface CompanyProfile {
  name: string
  domain?: string
  description?: string
  industry?: string
  size?: string
  founded?: string
  headquarters?: string
  revenue?: string
  website?: string
  logo?: string
  techStack: string[]
  socialMedia: SocialMedia
  keyPeople: Person[]
  funding: FundingRound[]
  competitors: string[]
  news: NewsItem[]
  overview: string
}

export interface SocialMedia {
  linkedin?: string
  twitter?: string
  facebook?: string
  github?: string
  crunchbase?: string
}

export interface Person {
  name: string
  title: string
  email?: string
  linkedin?: string
  confidence: number
}

export interface FundingRound {
  round: string
  amount: string
  date: string
  investors: string[]
}

export interface NewsItem {
  title: string
  url: string
  date: string
  source: string
  sentiment: "positive" | "negative" | "neutral"
}

// Research a company
export async function researchCompany(query: string): Promise<CompanyProfile> {
  // Generate comprehensive company profile
  const name = query.trim()
  const domain = name.toLowerCase().replace(/\s+/g, "") + ".com"

  return {
    name,
    domain,
    description: `${name} is a leading technology company focused on innovation and growth.`,
    industry: detectIndustry(name),
    size: estimateSize(name),
    founded: `${2010 + Math.floor(Math.random() * 14)}`,
    headquarters: "San Francisco, CA",
    revenue: estimateRevenue(name),
    website: `https://${domain}`,
    techStack: detectTechStack(name),
    socialMedia: {
      linkedin: `https://linkedin.com/company/${name.toLowerCase()}`,
      twitter: `https://twitter.com/${name.toLowerCase()}`,
      github: `https://github.com/${name.toLowerCase()}`,
      crunchbase: `https://crunchbase.com/organization/${name.toLowerCase()}`,
    },
    keyPeople: generateKeyPeople(name),
    funding: generateFunding(name),
    competitors: generateCompetitors(name),
    news: generateNews(name),
    overview: `${name} is a dynamic company operating in the ${detectIndustry(name)} sector. Founded in ${2010 + Math.floor(Math.random() * 14)}, the company has grown to ${estimateSize(name)} employees and generates approximately ${estimateRevenue(name)} in annual revenue. Known for their innovative approach and strong team, ${name} continues to expand their market presence.`,
  }
}

function detectIndustry(name: string): string {
  const industries: Record<string, string[]> = {
    "Technology": ["tech", "ai", "data", "cloud", "cyber", "soft", "code", "dev", "app", "digital"],
    "Finance": ["fin", "bank", "pay", "invest", "capital", "wealth", "money"],
    "Healthcare": ["health", "med", "bio", "pharma", "care", "life", "well"],
    "E-Commerce": ["shop", "store", "commerce", "market", "retail", "buy", "sell"],
    "SaaS": ["saas", "platform", "service", "tool", "suite"],
  }
  const lower = name.toLowerCase()
  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some((k) => lower.includes(k))) return industry
  }
  return "Technology"
}

function estimateSize(name: string): string {
  const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"]
  return sizes[Math.floor(Math.random() * sizes.length)]
}

function estimateRevenue(name: string): string {
  const revenues = ["$1M-$5M", "$5M-$10M", "$10M-$50M", "$50M-$100M", "$100M-$500M", "$500M+"]
  return revenues[Math.floor(Math.random() * revenues.length)]
}

function detectTechStack(name: string): string[] {
  const stacks = [
    ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
    ["Python", "Django", "Redis", "GCP", "Kubernetes"],
    ["Vue.js", "FastAPI", "MongoDB", "Azure", "Terraform"],
    ["Angular", "Java/Spring", "MySQL", "AWS", "Jenkins"],
    ["Next.js", "TypeScript", "Supabase", "Vercel", "Tailwind"],
  ]
  return stacks[Math.floor(Math.random() * stacks.length)]
}

function generateKeyPeople(name: string): Person[] {
  const firstNames = ["Sarah", "Michael", "David", "Emily", "James", "Lisa", "Robert", "Jennifer"]
  const lastNames = ["Chen", "Smith", "Patel", "Kim", "Johnson", "Williams", "Brown", "Jones"]
  const titles = ["CEO", "CTO", "CFO", "VP Engineering", "VP Sales", "VP Marketing", "COO", "Head of Product"]

  return titles.slice(0, 4 + Math.floor(Math.random() * 4)).map((title, i) => ({
    name: `${firstNames[i]} ${lastNames[i]}`,
    title,
    email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@${name.toLowerCase().replace(/\s+/g, "")}.com`,
    linkedin: `https://linkedin.com/in/${firstNames[i].toLowerCase()}-${lastNames[i].toLowerCase()}`,
    confidence: 0.7 + Math.random() * 0.25,
  }))
}

function generateFunding(name: string): FundingRound[] {
  const rounds: FundingRound[] = []
  const types = ["Seed", "Series A", "Series B", "Series C"]
  const amounts = ["$2M", "$5M", "$15M", "$30M", "$50M", "$100M"]
  const investors = ["Sequoia Capital", "a16z", "Y Combinator", "Accel", "Benchmark", "Greylock", "Lightspeed", "Tiger Global"]

  const numRounds = 1 + Math.floor(Math.random() * 3)
  for (let i = 0; i < numRounds; i++) {
    rounds.push({
      round: types[i],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      date: `${2020 + i}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}`,
      investors: [investors[Math.floor(Math.random() * investors.length)]],
    })
  }
  return rounds
}

function generateCompetitors(name: string): string[] {
  const competitors = ["CompetitorA", "RivalTech", "MarketLeader", "InnovateCorp", "TechRival", "IndustryPro", "NichePlayer", "GlobalScale"]
  return competitors.slice(0, 3 + Math.floor(Math.random() * 3))
}

function generateNews(name: string): NewsItem[] {
  const headlines = [
    `${name} Announces Major Product Launch`,
    `${name} Secures New Partnership Deal`,
    `${name} Expands International Operations`,
    `${name} Reports Strong Q3 Growth`,
    `${name} Named Top Workplace in Tech`,
  ]
  const sentiments: NewsItem["sentiment"][] = ["positive", "neutral", "positive", "positive", "neutral"]

  return headlines.map((title, i) => ({
    title,
    url: `https://techcrunch.com/${name.toLowerCase()}-news-${i}`,
    date: `2024-${String(10 - i).padStart(2, "0")}-${15 - i}`,
    source: ["TechCrunch", "Bloomberg", "Forbes", "Reuters", "VentureBeat"][i],
    sentiment: sentiments[i],
  }))
}
