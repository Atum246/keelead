// KeeLead — Tool definitions for AI function calling
export const KEELEAD_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "keelead_search_leads",
      description: "Search for business leads using natural language queries across 57 data sources. Returns structured lead data with confidence scores.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Natural language search query (e.g., 'Find 50 SaaS founders in San Francisco')" },
          count: { type: "number", description: "Maximum results to return (default: 25)" },
          location: { type: "string", description: "Filter by location" },
          industry: { type: "string", description: "Filter by industry" },
          title: { type: "string", description: "Filter by job title" },
          company: { type: "string", description: "Filter by company name" },
          sources: { type: "array", items: { type: "string" }, description: "Specific source IDs to search" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "keelead_verify_email",
      description: "Verify email addresses with 10-layer verification system. Returns score 0-100 with detailed breakdown.",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string", description: "Single email to verify" },
          emails: { type: "array", items: { type: "string" }, description: "Bulk verification" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "keelead_research_company",
      description: "Deep research on a company: overview, tech stack, key people, funding, competitors, news.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Company name or domain" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "keelead_find_contact",
      description: "Find contact information for a person by name, company, title, or email.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          company: { type: "string" },
          title: { type: "string" },
          location: { type: "string" },
          email: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "keelead_enrich_lead",
      description: "Enrich a lead with additional data from multiple sources.",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string" },
          name: { type: "string" },
          company: { type: "string" },
          domain: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "keelead_score_lead",
      description: "AI-powered lead scoring (0-100) based on ICP fit.",
      parameters: {
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
            properties: {
              titles: { type: "array", items: { type: "string" } },
              industries: { type: "array", items: { type: "string" } },
              locations: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "keelead_email_pattern",
      description: "Find common email patterns for a domain.",
      parameters: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Company domain" },
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
        required: ["domain", "firstName", "lastName"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "keelead_list_sources",
      description: "List all 57 available data sources with status.",
      parameters: { type: "object", properties: {} },
    },
  },
]
