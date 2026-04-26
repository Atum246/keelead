// KeeLead — Source Manager: Registry and orchestration for all data sources
import type { DataSource, Lead, CompanyData, ContactData, SearchOptions, SourceCategory } from "./types"

// Import all sources
import googleSource from "./search/google"
import bingSource from "./search/bing"
import duckduckgoSource from "./search/duckduckgo"
import braveSource from "./search/brave"
import searxngSource from "./search/searxng"

import linkedinSource from "./professional/linkedin"
import xingSource from "./professional/xing"
import angellistSource from "./professional/angellist"
import crunchbaseSource from "./professional/crunchbase"

import opencorporatesSource from "./company/opencorporates"
import secEdgarSource from "./company/sec-edgar"
import companiesHouseSource from "./company/companies-house"
import glassdoorSource from "./company/glassdoor"
import indeedSource from "./company/indeed"
import builtinSource from "./company/builtin"
import g2Source from "./company/g2"

import googleMapsSource from "./local/google-maps"
import yelpSource from "./local/yelp"
import yellowpagesSource from "./local/yellowpages"
import foursquareSource from "./local/foursquare"
import bbbSource from "./local/bbb"
import chamberOfCommerceSource from "./local/chamberofcommerce"
import thumbtackSource from "./local/thumbtack"
import homeadvisorSource from "./local/homeadvisor"

import twitterSource from "./social/twitter"
import githubSource from "./social/github"
import redditSource from "./social/reddit"
import facebookSource from "./social/facebook"
import instagramSource from "./social/instagram"
import tiktokSource from "./social/tiktok"
import youtubeSource from "./social/youtube"
import pinterestSource from "./social/pinterest"

import githubOrgsSource from "./developer/github-orgs"
import stackoverflowSource from "./developer/stackoverflow"
import devtoSource from "./developer/devto"
import npmSource from "./developer/npm"
import pypiSource from "./developer/pypi"
import dockerhubSource from "./developer/dockerhub"

import producthuntSource from "./startup/producthunt"
import indiehackersSource from "./startup/indiehackers"
import betalistSource from "./startup/betalist"
import f6sSource from "./startup/f6s"
import gustSource from "./startup/gust"

import samgovSource from "./government/samgov"
import usaspendingSource from "./government/usaspending"
import censusSource from "./government/census"
import euRegisterSource from "./government/eu-register"
import patentsSource from "./government/patents"
import trademarksSource from "./government/trademarks"

import googleScholarSource from "./education/google-scholar"
import researchgateSource from "./education/researchgate"
import orcidSource from "./education/orcid"
import academiaSource from "./education/academia"

import hunterSource from "./email/hunter"
import clearbitSource from "./email/clearbit"
import whoisSource from "./email/whois"
import dnsLookupSource from "./email/dns-lookup"
import sslCertSource from "./email/ssl-cert"

import eventbriteSource from "./events/eventbrite"
import meetupSource from "./events/meetup"
import lumaSource from "./events/luma"
import conferenceSpeakersSource from "./events/conference-speakers"

// Master registry — 57 data sources
const ALL_SOURCES: DataSource[] = [
  // Search (5)
  googleSource, bingSource, duckduckgoSource, braveSource, searxngSource,
  // Professional (4)
  linkedinSource, xingSource, angellistSource, crunchbaseSource,
  // Company (7)
  opencorporatesSource, secEdgarSource, companiesHouseSource, glassdoorSource, indeedSource, builtinSource, g2Source,
  // Local (8)
  googleMapsSource, yelpSource, yellowpagesSource, foursquareSource, bbbSource, chamberOfCommerceSource, thumbtackSource, homeadvisorSource,
  // Social (8)
  twitterSource, githubSource, redditSource, facebookSource, instagramSource, tiktokSource, youtubeSource, pinterestSource,
  // Developer (6)
  githubOrgsSource, stackoverflowSource, devtoSource, npmSource, pypiSource, dockerhubSource,
  // Startup (5)
  producthuntSource, indiehackersSource, betalistSource, f6sSource, gustSource,
  // Government (6)
  samgovSource, usaspendingSource, censusSource, euRegisterSource, patentsSource, trademarksSource,
  // Education (4)
  googleScholarSource, researchgateSource, orcidSource, academiaSource,
  // Email (5)
  hunterSource, clearbitSource, whoisSource, dnsLookupSource, sslCertSource,
  // Events (4)
  eventbriteSource, meetupSource, lumaSource, conferenceSpeakersSource,
]

export class SourceManager {
  private sources: Map<string, DataSource>
  private weights: Map<string, number>

  constructor() {
    this.sources = new Map()
    this.weights = new Map()
    for (const source of ALL_SOURCES) {
      this.sources.set(source.id, source)
      this.weights.set(source.id, 1.0)
    }
  }

  /** Get all registered sources */
  getAll(): DataSource[] {
    return Array.from(this.sources.values())
  }

  /** Get only enabled sources */
  getEnabled(): DataSource[] {
    return this.getAll().filter((s) => s.enabled)
  }

  /** Get sources by category */
  getByCategory(category: SourceCategory): DataSource[] {
    return this.getAll().filter((s) => s.category === category)
  }

  /** Get a source by ID */
  get(id: string): DataSource | undefined {
    return this.sources.get(id)
  }

  /** Enable/disable a source */
  setEnabled(id: string, enabled: boolean): void {
    const source = this.sources.get(id)
    if (source) source.enabled = enabled
  }

  /** Set weight for a source (affects result ranking) */
  setWeight(id: string, weight: number): void {
    this.weights.set(id, Math.max(0, Math.min(5, weight)))
  }

  /** Get weight for a source */
  getWeight(id: string): number {
    return this.weights.get(id) || 1.0
  }

  /** Search across all enabled sources with concurrency control */
  async searchAll(query: string, options?: SearchOptions): Promise<Lead[]> {
    const enabled = this.getEnabled()
    const batchSize = 5 // concurrent requests
    const allLeads: Lead[] = []

    for (let i = 0; i < enabled.length; i += batchSize) {
      const batch = enabled.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map(async (source) => {
          const weight = this.weights.get(source.id) || 1.0
          const leads = await source.search(query, options)
          return leads.map((l) => ({
            ...l,
            confidence: Math.min(1, l.confidence * weight),
            source: source.name,
          }))
        })
      )
      for (const result of results) {
        if (result.status === "fulfilled") {
          allLeads.push(...result.value)
        }
      }
    }

    return this.deduplicate(allLeads)
  }

  /** Search specific sources by ID */
  async searchSources(sourceIds: string[], query: string, options?: SearchOptions): Promise<Lead[]> {
    const allLeads: Lead[] = []
    const promises = sourceIds.map(async (id) => {
      const source = this.sources.get(id)
      if (!source || !source.enabled) return []
      try {
        return await source.search(query, options)
      } catch {
        return []
      }
    })
    const results = await Promise.allSettled(promises)
    for (const result of results) {
      if (result.status === "fulfilled") allLeads.push(...result.value)
    }
    return this.deduplicate(allLeads)
  }

  /** Research a company across all sources that support it */
  async researchCompany(domain: string): Promise<CompanyData | null> {
    const enabled = this.getEnabled().filter((s) => s.getCompany)
    for (const source of enabled) {
      try {
        const data = await source.getCompany!(domain)
        if (data) return data
      } catch {
        continue
      }
    }
    return null
  }

  /** Find a contact across all sources that support it */
  async findContact(email: string): Promise<ContactData | null> {
    const enabled = this.getEnabled().filter((s) => s.getContact)
    for (const source of enabled) {
      try {
        const data = await source.getContact!(email)
        if (data && data.confidence > 0.5) return data
      } catch {
        continue
      }
    }
    return null
  }

  /** Get summary stats */
  getStats() {
    const all = this.getAll()
    const categories: Record<string, number> = {}
    let apiRequired = 0
    let enabled = 0

    for (const s of all) {
      categories[s.category] = (categories[s.category] || 0) + 1
      if (s.requiresApiKey) apiRequired++
      if (s.enabled) enabled++
    }

    return {
      total: all.length,
      enabled,
      apiKeyRequired: apiRequired,
      free: all.length - apiRequired,
      categories,
    }
  }

  /** Deduplicate leads by email or name+company */
  private deduplicate(leads: Lead[]): Lead[] {
    const seen = new Set<string>()
    return leads.filter((lead) => {
      const key = lead.email || `${lead.firstName}-${lead.lastName}-${lead.company}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).sort((a, b) => b.confidence - a.confidence)
  }
}

// Singleton
export const sourceManager = new SourceManager()

// Re-export types
export type { DataSource, Lead, CompanyData, ContactData, SearchOptions, SourceCategory } from "./types"
