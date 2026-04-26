/**
 * KeeLead LangChain Tools
 * 
 * Drop-in tools for LangChain agents. Use KeeLead's capabilities
 * as LangChain tools in any agent pipeline.
 * 
 * Usage:
 *   import { keeleadTools } from "keelead/langchain"
 *   const agent = createOpenAIFunctionsAgent({ tools: keeleadTools, ... })
 */

import { Tool } from "@langchain/core/tools"
import { z } from "zod"

const API_URL = process.env.KEELEAD_API_URL || "http://localhost:3000"

async function apiCall(path: string, method: string = "GET", body?: unknown) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

// ─── LEAD SEARCH TOOL ────────────────────────────────────────────────────────

export class KeeLeadSearchTool extends Tool {
  name = "keelead_search"
  description = `Search for business leads using natural language. 
Input should be a search query like "Find 50 SaaS founders in San Francisco" or "Search for CTOs at fintech companies".
Returns structured lead data with names, emails, companies, titles, and confidence scores.`

  schema = z.object({
    query: z.string().describe("Natural language search query for leads"),
  })

  async _call({ query }: { query: string }): Promise<string> {
    const result = await apiCall("/leads", "POST", { query, count: 25 })
    return JSON.stringify(result, null, 2)
  }
}

// ─── EMAIL VERIFICATION TOOL ─────────────────────────────────────────────────

export class KeeLeadVerifyTool extends Tool {
  name = "keelead_verify_email"
  description = `Verify email addresses with 10-layer verification.
Input should be an email address or comma-separated list of emails.
Returns verification score (0-100), status (valid/invalid/catch-all/disposable), and detailed breakdown.`

  schema = z.object({
    email: z.string().describe("Email address(es) to verify, comma-separated for bulk"),
  })

  async _call({ email }: { email: string }): Promise<string> {
    const emails = email.split(",").map((e) => e.trim())
    const result = await apiCall("/verify", "POST", { emails })
    return JSON.stringify(result, null, 2)
  }
}

// ─── COMPANY RESEARCH TOOL ───────────────────────────────────────────────────

export class KeeLeadResearchTool extends Tool {
  name = "keelead_research_company"
  description = `Research a company in depth. Input should be a company name or domain.
Returns: overview, industry, size, revenue, tech stack, key people, funding history, competitors, news.`

  schema = z.object({
    company: z.string().describe("Company name or domain to research"),
  })

  async _call({ company }: { company: string }): Promise<string> {
    const result = await apiCall("/research", "POST", { query: company })
    return JSON.stringify(result, null, 2)
  }
}

// ─── CONTACT FINDER TOOL ─────────────────────────────────────────────────────

export class KeeLeadContactTool extends Tool {
  name = "keelead_find_contact"
  description = `Find contact information for a specific person.
Input should describe who to find, e.g., "CTO of Stripe" or "Sarah Chen at CloudSync".
Returns name, email, phone, LinkedIn, company, title with confidence scores.`

  schema = z.object({
    query: z.string().describe("Who to find: name, title, company, location"),
  })

  async _call({ query }: { query: string }): Promise<string> {
    const result = await apiCall("/leads", "POST", { query, count: 10 })
    return JSON.stringify(result, null, 2)
  }
}

// ─── LEAD ENRICHMENT TOOL ────────────────────────────────────────────────────

export class KeeLeadEnrichTool extends Tool {
  name = "keelead_enrich_lead"
  description = `Enrich a lead with additional data from multiple sources.
Input should be an email, name+company, or domain.
Returns enriched data: email, phone, social profiles, firmographic, technographic.`

  schema = z.object({
    email: z.string().optional().describe("Email to enrich"),
    name: z.string().optional().describe("Person's name"),
    company: z.string().optional().describe("Company name"),
    domain: z.string().optional().describe("Company domain"),
  })

  async _call(params: { email?: string; name?: string; company?: string; domain?: string }): Promise<string> {
    const result = await apiCall("/enrich", "POST", params)
    return JSON.stringify(result, null, 2)
  }
}

// ─── INTENT SIGNALS TOOL ─────────────────────────────────────────────────────

export class KeeLeadSignalsTool extends Tool {
  name = "keelead_get_signals"
  description = `Get intent signals for a company: job changes, hiring, funding, news, social mentions.
Input should be a company name. Optionally specify signal type.`

  schema = z.object({
    company: z.string().describe("Company name to get signals for"),
    type: z.enum(["job_change", "hiring", "funding", "news", "social", "product", "all"]).optional().describe("Signal type filter"),
  })

  async _call({ company, type }: { company: string; type?: string }): Promise<string> {
    const result = await apiCall("/signals", "POST", { company, type: type === "all" ? undefined : type })
    return JSON.stringify(result, null, 2)
  }
}

// ─── LEAD SCORING TOOL ───────────────────────────────────────────────────────

export class KeeLeadScoreTool extends Tool {
  name = "keelead_score_lead"
  description = `Score a lead (0-100) based on ICP fit and intent signals.
Input should include lead details and optionally an ICP (Ideal Customer Profile).`

  schema = z.object({
    title: z.string().optional().describe("Lead's job title"),
    company: z.string().optional().describe("Lead's company"),
    industry: z.string().optional().describe("Lead's industry"),
    location: z.string().optional().describe("Lead's location"),
  })

  async _call(params: { title?: string; company?: string; industry?: string; location?: string }): Promise<string> {
    const result = await apiCall("/score", "POST", { lead: params })
    return JSON.stringify(result, null, 2)
  }
}

// ─── EXPORT TOOL ─────────────────────────────────────────────────────────────

export class KeeLeadExportTool extends Tool {
  name = "keelead_export_leads"
  description = `Export leads to various formats (CSV, JSON, Excel, vCard, PDF).
Specify format and optional filters.`

  schema = z.object({
    format: z.enum(["csv", "json", "xlsx", "vcard", "pdf"]).describe("Export format"),
    status: z.string().optional().describe("Filter by status: new, contacted, qualified, converted"),
  })

  async _call({ format, status }: { format: string; status?: string }): Promise<string> {
    const result = await apiCall("/export", "POST", { format, filters: { status } })
    return JSON.stringify(result, null, 2)
  }
}

// ─── TOOL COLLECTION ─────────────────────────────────────────────────────────

export const keeleadTools = [
  new KeeLeadSearchTool(),
  new KeeLeadVerifyTool(),
  new KeeLeadResearchTool(),
  new KeeLeadContactTool(),
  new KeeLeadEnrichTool(),
  new KeeLeadSignalsTool(),
  new KeeLeadScoreTool(),
  new KeeLeadExportTool(),
]

export default keeleadTools
