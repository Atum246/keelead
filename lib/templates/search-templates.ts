// KeeLead — Search templates
export interface SearchTemplate {
  id: string
  name: string
  description: string
  query: string
  filters: Record<string, unknown>
  sources: string[]
  category: string
}

export const SEARCH_TEMPLATES: SearchTemplate[] = [
  {
    id: "saas-founders-sf",
    name: "SaaS Founders in San Francisco",
    description: "Find SaaS company founders and CEOs in the SF Bay Area",
    query: "SaaS founder CEO San Francisco",
    filters: { location: "San Francisco, CA", title: "Founder,CEO,Co-Founder", industry: "SaaS" },
    sources: ["linkedin", "crunchbase", "angellist", "producthunt"],
    category: "startup",
  },
  {
    id: "vp-engineering-series-b",
    name: "VP Engineering at Series B+ Companies",
    description: "Find VP Engineering at well-funded tech companies",
    query: "VP Engineering Series B technology company",
    filters: { title: "VP Engineering,Head of Engineering", industry: "Technology" },
    sources: ["linkedin", "crunchbase", "glassdoor"],
    category: "enterprise",
  },
  {
    id: "local-restaurants",
    name: "Local Restaurants",
    description: "Find restaurant owners and managers in a specific area",
    query: "restaurant owner manager",
    filters: { industry: "Restaurant,Food & Beverage" },
    sources: ["google-maps", "yelp", "yellowpages", "bbb"],
    category: "local",
  },
  {
    id: "ecommerce-dtc",
    name: "DTC E-Commerce Brands",
    description: "Find direct-to-consumer e-commerce companies",
    query: "DTC e-commerce brand founder",
    filters: { industry: "E-Commerce,Retail" },
    sources: ["crunchbase", "producthunt", "linkedin"],
    category: "ecommerce",
  },
  {
    id: "open-source-maintainers",
    name: "Open Source Maintainers",
    description: "Find popular open source project maintainers",
    query: "open source maintainer popular project",
    filters: { industry: "Software,Developer Tools" },
    sources: ["github", "npm", "pypi", "stackoverflow", "devto"],
    category: "developer",
  },
  {
    id: "fintech-startups",
    name: "FinTech Startups",
    description: "Find fintech startup founders and key people",
    query: "fintech startup founder CEO",
    filters: { industry: "Finance,FinTech" },
    sources: ["crunchbase", "angellist", "linkedin", "producthunt"],
    category: "fintech",
  },
  {
    id: "government-contractors",
    name: "US Government Contractors",
    description: "Find companies that do business with the US government",
    query: "government contractor federal",
    filters: { industry: "Government,Defense" },
    sources: ["samgov", "usaspending"],
    category: "government",
  },
  {
    id: "academic-researchers-ai",
    name: "AI/ML Academic Researchers",
    description: "Find researchers publishing in AI/ML",
    query: "artificial intelligence machine learning researcher",
    filters: { industry: "AI,Machine Learning,Research" },
    sources: ["google-scholar", "researchgate", "orcid"],
    category: "academic",
  },
]

export function getSearchTemplate(id: string): SearchTemplate | undefined {
  return SEARCH_TEMPLATES.find((t) => t.id === id)
}

export function getSearchTemplatesByCategory(category: string): SearchTemplate[] {
  return SEARCH_TEMPLATES.filter((t) => t.category === category)
}
