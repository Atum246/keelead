import { NextResponse } from "next/server"

// 57 data sources across 11 categories
const SOURCES = [
  // Search (5)
  { id: "google", name: "Google", category: "search", requiresApiKey: true, rateLimit: 100, enabled: true },
  { id: "bing", name: "Bing", category: "search", requiresApiKey: true, rateLimit: 100, enabled: true },
  { id: "duckduckgo", name: "DuckDuckGo", category: "search", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "brave", name: "Brave", category: "search", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "searxng", name: "SearXNG", category: "search", requiresApiKey: false, rateLimit: 120, enabled: true },
  // Professional (4)
  { id: "linkedin", name: "LinkedIn", category: "professional", requiresApiKey: false, rateLimit: 20, enabled: true },
  { id: "xing", name: "Xing", category: "professional", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "angellist", name: "AngelList", category: "professional", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "crunchbase", name: "Crunchbase", category: "professional", requiresApiKey: true, rateLimit: 60, enabled: true },
  // Company (7)
  { id: "opencorporates", name: "OpenCorporates", category: "company", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "sec-edgar", name: "SEC EDGAR", category: "company", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "companies-house", name: "Companies House", category: "company", requiresApiKey: false, rateLimit: 600, enabled: true },
  { id: "glassdoor", name: "Glassdoor", category: "company", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "indeed", name: "Indeed", category: "company", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "builtin", name: "Builtin", category: "company", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "g2", name: "G2", category: "company", requiresApiKey: true, rateLimit: 30, enabled: true },
  // Local (8)
  { id: "google-maps", name: "Google Maps", category: "local", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "yelp", name: "Yelp", category: "local", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "yellowpages", name: "Yellow Pages", category: "local", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "foursquare", name: "Foursquare", category: "local", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "bbb", name: "Better Business Bureau", category: "local", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "chamberofcommerce", name: "Chamber of Commerce", category: "local", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "thumbtack", name: "Thumbtack", category: "local", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "homeadvisor", name: "HomeAdvisor", category: "local", requiresApiKey: true, rateLimit: 30, enabled: true },
  // Social (8)
  { id: "twitter", name: "Twitter/X", category: "social", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "github", name: "GitHub", category: "social", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "reddit", name: "Reddit", category: "social", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "facebook", name: "Facebook", category: "social", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "instagram", name: "Instagram", category: "social", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "tiktok", name: "TikTok", category: "social", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "youtube", name: "YouTube", category: "social", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "pinterest", name: "Pinterest", category: "social", requiresApiKey: true, rateLimit: 30, enabled: true },
  // Developer (6)
  { id: "github-orgs", name: "GitHub Organizations", category: "developer", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "stackoverflow", name: "Stack Overflow", category: "developer", requiresApiKey: true, rateLimit: 30, enabled: true },
  { id: "devto", name: "Dev.to", category: "developer", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "npm", name: "NPM", category: "developer", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "pypi", name: "PyPI", category: "developer", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "dockerhub", name: "Docker Hub", category: "developer", requiresApiKey: false, rateLimit: 60, enabled: true },
  // Startup (5)
  { id: "producthunt", name: "Product Hunt", category: "startup", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "indiehackers", name: "Indie Hackers", category: "startup", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "betalist", name: "Beta List", category: "startup", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "f6s", name: "F6S", category: "startup", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "gust", name: "Gust", category: "startup", requiresApiKey: true, rateLimit: 30, enabled: true },
  // Government (6)
  { id: "samgov", name: "SAM.gov", category: "government", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "usaspending", name: "USASpending", category: "government", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "census", name: "US Census", category: "government", requiresApiKey: false, rateLimit: 60, enabled: true },
  { id: "eu-register", name: "EU Transparency Register", category: "government", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "patents", name: "USPTO Patents", category: "government", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "trademarks", name: "USPTO Trademarks", category: "government", requiresApiKey: true, rateLimit: 30, enabled: true },
  // Education (4)
  { id: "google-scholar", name: "Google Scholar", category: "education", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "researchgate", name: "ResearchGate", category: "education", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "orcid", name: "ORCID", category: "education", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "academia", name: "Academia.edu", category: "education", requiresApiKey: false, rateLimit: 30, enabled: true },
  // Email (5)
  { id: "hunter", name: "Hunter.io", category: "email", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "clearbit", name: "Clearbit", category: "email", requiresApiKey: true, rateLimit: 600, enabled: true },
  { id: "whois", name: "WHOIS", category: "email", requiresApiKey: false, rateLimit: 30, enabled: true },
  { id: "dns-lookup", name: "DNS Lookup", category: "email", requiresApiKey: false, rateLimit: 120, enabled: true },
  { id: "ssl-cert", name: "SSL Certificate", category: "email", requiresApiKey: false, rateLimit: 60, enabled: true },
  // Events (4)
  { id: "eventbrite", name: "Eventbrite", category: "events", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "meetup", name: "Meetup", category: "events", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "luma", name: "Luma", category: "events", requiresApiKey: true, rateLimit: 60, enabled: true },
  { id: "conference-speakers", name: "Conference Speakers", category: "events", requiresApiKey: false, rateLimit: 30, enabled: true },
]

export async function GET() {
  const categories: Record<string, number> = {}
  let free = 0
  for (const s of SOURCES) {
    categories[s.category] = (categories[s.category] || 0) + 1
    if (!s.requiresApiKey) free++
  }

  return NextResponse.json({
    sources: SOURCES,
    total: SOURCES.length,
    enabled: SOURCES.filter((s) => s.enabled).length,
    free,
    paid: SOURCES.length - free,
    categories,
  })
}
