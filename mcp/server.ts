#!/usr/bin/env tsx
/**
 * KeeLead MCP Server — Model Context Protocol
 * 
 * Exposes KeeLead's lead generation capabilities as MCP tools
 * for AI agents like OpenClaw, Claude Code, Cursor, LangChain, etc.
 * 
 * 57 data sources • 10 tools • 5 resources • 4 prompts
 * 
 * Usage:
 *   npx tsx mcp/server.ts
 *   
 * Or with API URL:
 *   KEELEAD_API_URL=http://localhost:3000 npx tsx mcp/server.ts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

const API_URL = process.env.KEELEAD_API_URL || "http://localhost:3000"

// Helper to call KeeLead API
async function apiCall(path: string, method: string = "GET", body?: unknown) {
  try {
    const res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    })
    return res.json()
  } catch (err) {
    return { error: `API call failed: ${err instanceof Error ? err.message : String(err)}` }
  }
}

// Create MCP server
const server = new Server(
  { name: "keelead", version: "2.0.0" },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
)

// ─── TOOLS ───────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "keelead_search_leads",
      description: "Search for business leads across 57 data sources using natural language. Supports searching by name, company, title, location, industry. Returns structured lead data with confidence scores.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Natural language search query (e.g., 'Find 50 SaaS founders in San Francisco')" },
          count: { type: "number", description: "Maximum number of results to return (default: 25)" },
          location: { type: "string", description: "Filter by location" },
          industry: { type: "string", description: "Filter by industry" },
          sources: { type: "array", items: { type: "string" }, description: "Specific source IDs to search (e.g., ['linkedin', 'crunchbase'])" },
        },
        required: ["query"],
      },
    },
    {
      name: "keelead_verify_email",
      description: "Verify email addresses with 10-layer verification: syntax (RFC 5322), domain existence, MX records, disposable detection (30+ providers), role-based detection, typo suggestion, SMTP check, catch-all detection, spam trap detection, free provider detection. Returns score 0-100.",
      inputSchema: {
        type: "object",
        properties: {
          email: { type: "string", description: "Email address to verify" },
          emails: { type: "array", items: { type: "string" }, description: "Array of emails for bulk verification" },
        },
      },
    },
    {
      name: "keelead_research_company",
      description: "Deep research on a company: overview, tech stack, key people, funding history, competitors, news with sentiment analysis, social media presence.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Company name or domain to research" },
        },
        required: ["query"],
      },
    },
    {
      name: "keelead_find_contact",
      description: "Find contact information for a specific person by name, company, title, or location.",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Person's full name" },
          company: { type: "string", description: "Company name" },
          title: { type: "string", description: "Job title" },
          location: { type: "string", description: "Location" },
        },
      },
    },
    {
      name: "keelead_enrich_lead",
      description: "Enrich a lead with additional data from multiple sources: email, phone, social profiles, firmographic, technographic data, email patterns.",
      inputSchema: {
        type: "object",
        properties: {
          email: { type: "string", description: "Email to enrich" },
          name: { type: "string", description: "Full name" },
          company: { type: "string", description: "Company name" },
          domain: { type: "string", description: "Company domain" },
        },
      },
    },
    {
      name: "keelead_export_leads",
      description: "Export leads to various formats (CSV, JSON, Excel, vCard, PDF). Supports templates for HubSpot/Salesforce import.",
      inputSchema: {
        type: "object",
        properties: {
          format: { type: "string", enum: ["csv", "json", "xlsx", "vcard", "pdf"], description: "Export format" },
          template: { type: "string", description: "Export template ID (e.g., 'leads-hubspot', 'leads-salesforce')" },
          filters: {
            type: "object",
            properties: {
              status: { type: "string" },
              source: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
            },
          },
        },
        required: ["format"],
      },
    },
    {
      name: "keelead_get_signals",
      description: "Get intent signals for a company: job changes, hiring news, funding events, product launches, social mentions.",
      inputSchema: {
        type: "object",
        properties: {
          company: { type: "string", description: "Company name to get signals for" },
          type: { type: "string", enum: ["job_change", "hiring", "funding", "news", "social", "product"], description: "Signal type filter" },
        },
        required: ["company"],
      },
    },
    {
      name: "keelead_email_pattern",
      description: "Find common email patterns for a domain. Returns common formats like first.last@, first@, f.last@, etc.",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Company domain (e.g., 'acme.com')" },
          firstName: { type: "string", description: "First name to test patterns with" },
          lastName: { type: "string", description: "Last name to test patterns with" },
        },
        required: ["domain", "firstName", "lastName"],
      },
    },
    {
      name: "keelead_list_sources",
      description: "List all 57 available data sources across 11 categories: search, professional, company, local, social, developer, startup, government, education, email, events.",
      inputSchema: {
        type: "object",
        properties: {
          category: { type: "string", description: "Filter by category" },
          enabled: { type: "boolean", description: "Filter by enabled status" },
        },
      },
    },
    {
      name: "keelead_lead_score",
      description: "AI-powered lead scoring (0-100) based on ICP fit, intent signals, engagement history, and firmographic data.",
      inputSchema: {
        type: "object",
        properties: {
          lead: {
            type: "object",
            properties: {
              title: { type: "string" },
              company: { type: "string" },
              industry: { type: "string" },
              location: { type: "string" },
            },
          },
          icp: {
            type: "object",
            description: "Ideal Customer Profile to score against",
            properties: {
              titles: { type: "array", items: { type: "string" } },
              industries: { type: "array", items: { type: "string" } },
              locations: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    let result: unknown

    switch (name) {
      case "keelead_search_leads": {
        result = await apiCall("/leads", "POST", {
          query: args?.query,
          count: args?.count || 25,
          location: args?.location,
          industry: args?.industry,
          sources: args?.sources,
        })
        break
      }
      case "keelead_verify_email": {
        result = await apiCall("/verify", "POST", {
          email: args?.email,
          emails: args?.emails,
        })
        break
      }
      case "keelead_research_company": {
        result = await apiCall("/research", "POST", { query: args?.query })
        break
      }
      case "keelead_find_contact": {
        const query = `Find ${args?.name || "contact"} ${args?.company ? `at ${args.company}` : ""} ${args?.title || ""} ${args?.location ? `in ${args.location}` : ""}`
        result = await apiCall("/leads", "POST", { query, count: 10 })
        break
      }
      case "keelead_enrich_lead": {
        result = await apiCall("/enrich", "POST", args)
        break
      }
      case "keelead_export_leads": {
        result = await apiCall("/export", "POST", {
          format: args?.format,
          template: args?.template,
          filters: args?.filters,
        })
        break
      }
      case "keelead_get_signals": {
        result = await apiCall("/signals", "POST", {
          company: args?.company,
          type: args?.type,
        })
        break
      }
      case "keelead_email_pattern": {
        result = await apiCall("/enrich/patterns", "POST", args)
        break
      }
      case "keelead_list_sources": {
        result = await apiCall("/sources", "GET")
        break
      }
      case "keelead_lead_score": {
        result = await apiCall("/score", "POST", args)
        break
      }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    }
  }
})

// ─── RESOURCES ───────────────────────────────────────────────────────────────

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "keelead://leads",
      name: "Lead Database",
      description: "Access all leads in the KeeLead database",
      mimeType: "application/json",
    },
    {
      uri: "keelead://campaigns",
      name: "Campaigns",
      description: "Access campaign data and stats",
      mimeType: "application/json",
    },
    {
      uri: "keelead://signals",
      name: "Intent Signals",
      description: "Access intent signals (job changes, funding, hiring)",
      mimeType: "application/json",
    },
    {
      uri: "keelead://sources",
      name: "Data Sources (57)",
      description: "List all 57 data sources across 11 categories",
      mimeType: "application/json",
    },
    {
      uri: "keelead://templates",
      name: "Templates",
      description: "Email templates, search templates, export templates",
      mimeType: "application/json",
    },
  ],
}))

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri
  const resource = uri.replace("keelead://", "")
  
  let data: unknown
  switch (resource) {
    case "leads":
      data = await apiCall("/leads?limit=100")
      break
    case "campaigns":
      data = await apiCall("/campaigns")
      break
    case "signals":
      data = await apiCall("/signals")
      break
    case "sources":
      data = await apiCall("/sources")
      break
    case "templates":
      data = await apiCall("/templates")
      break
    default:
      throw new Error(`Unknown resource: ${resource}`)
  }

  return {
    contents: [{ uri, mimeType: "application/json", text: JSON.stringify(data, null, 2) }],
  }
})

// ─── PROMPTS ─────────────────────────────────────────────────────────────────

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "generate_outreach",
      description: "Generate a personalized outreach email for a lead",
      arguments: [
        { name: "leadName", description: "Lead's full name", required: true },
        { name: "company", description: "Lead's company", required: true },
        { name: "title", description: "Lead's job title", required: true },
        { name: "purpose", description: "Outreach purpose", required: true },
        { name: "tone", description: "Email tone: formal, casual, friendly", required: false },
      ],
    },
    {
      name: "research_and_score",
      description: "Research a company and score it as a lead",
      arguments: [
        { name: "company", description: "Company name to research", required: true },
        { name: "icp", description: "Ideal customer profile (JSON)", required: false },
      ],
    },
    {
      name: "find_similar",
      description: "Find leads similar to a given profile",
      arguments: [
        { name: "profile", description: "Lead profile to match (JSON)", required: true },
        { name: "count", description: "Number of similar leads to find", required: false },
      ],
    },
    {
      name: "enrich_and_outreach",
      description: "Full pipeline: find lead → enrich → score → generate outreach",
      arguments: [
        { name: "query", description: "Who to find", required: true },
        { name: "purpose", description: "Outreach purpose", required: true },
      ],
    },
  ],
}))

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  switch (name) {
    case "generate_outreach":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Generate a personalized ${args?.tone || "friendly"} outreach email for:\n\nName: ${args?.leadName}\nCompany: ${args?.company}\nTitle: ${args?.title}\nPurpose: ${args?.purpose}\n\nUse KeeLead to research the company first (57 sources available), then craft a highly personalized email referencing specific details about their business.`,
            },
          },
        ],
      }
    case "research_and_score":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Research ${args?.company} using KeeLead's research tool (sources: OpenCorporates, SEC EDGAR, Companies House, Glassdoor, Crunchbase, and more), then score it as a lead.${args?.icp ? ` ICP: ${args.icp}` : ""}\n\nProvide: company overview, tech stack, key people, funding, and a lead score with reasoning.`,
            },
          },
        ],
      }
    case "find_similar":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Find ${args?.count || 10} leads similar to this profile:\n${args?.profile}\n\nUse KeeLead to search across all 57 data sources and return leads with similar titles, industries, and company sizes.`,
            },
          },
        ],
      }
    case "enrich_and_outreach":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Full pipeline: Search for "${args?.query}" using KeeLead (57 sources), enrich the top results with additional data, score them, and generate personalized outreach emails for the top 3.\n\nPurpose: ${args?.purpose}`,
            },
          },
        ],
      }
    default:
      throw new Error(`Unknown prompt: ${name}`)
  }
})

// ─── START ───────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("KeeLead MCP Server v2.0 running on stdio (57 sources, 10 tools, 5 resources, 4 prompts)")
}

main().catch(console.error)
