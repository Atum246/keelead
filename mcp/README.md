# KeeLead MCP Server — Model Context Protocol Integration

> **v2.0** — 57 data sources • 10 tools • 5 resources • 4 prompts

MCP (Model Context Protocol) is the standard way for AI agents to connect to external tools and data sources. KeeLead exposes all its capabilities as MCP tools that any compatible agent can use.

## Quick Start

### For OpenClaw
Add to your OpenClaw config (`~/.openclaw/openclaw.json`):
```json
{
  "mcpServers": {
    "keelead": {
      "command": "npx",
      "args": ["tsx", "/path/to/keelead/mcp/server.ts"],
      "env": {
        "KEELEAD_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

### For Claude Code
```bash
claude mcp add keelead -- npx tsx /path/to/keelead/mcp/server.ts
```

### For Cursor / Windsurf
Add to `.cursor/mcp.json` or settings:
```json
{
  "mcpServers": {
    "keelead": {
      "command": "npx",
      "args": ["tsx", "/path/to/keelead/mcp/server.ts"]
    }
  }
}
```

### For Cline (VS Code)
Add to Cline MCP settings:
```json
{
  "keelead": {
    "command": "npx",
    "args": ["tsx", "/path/to/keelead/mcp/server.ts"],
    "env": {
      "KEELEAD_API_URL": "http://localhost:3000"
    }
  }
}
```

### For Any MCP-Compatible Agent
```bash
# Start the server (stdio mode)
npx tsx mcp/server.ts

# Or with custom API URL
KEELEAD_API_URL=http://your-server:3000 npx tsx mcp/server.ts
```

## Available Tools (10)

| Tool | Description |
|------|-------------|
| `keelead_search_leads` | Search across 57 data sources with natural language |
| `keelead_verify_email` | 10-layer email verification (score 0-100) |
| `keelead_research_company` | Deep company research (tech stack, funding, people) |
| `keelead_find_contact` | Find contact information by name/company/title |
| `keelead_enrich_lead` | Enrich leads with data from multiple sources |
| `keelead_export_leads` | Export to CSV/JSON/Excel/vCard/PDF |
| `keelead_get_signals` | Intent signals (job changes, funding, hiring) |
| `keelead_email_pattern` | Find email patterns for a domain |
| `keelead_list_sources` | List all 57 data sources |
| `keelead_lead_score` | AI lead scoring against ICP (0-100) |

## Available Resources (5)

| Resource | Description |
|----------|-------------|
| `keelead://leads` | Access lead database |
| `keelead://campaigns` | Access campaigns |
| `keelead://signals` | Access intent signals |
| `keelead://sources` | List 57 data sources |
| `keelead://templates` | Email/search/export templates |

## Available Prompts (4)

| Prompt | Description |
|--------|-------------|
| `generate_outreach` | Generate personalized outreach email |
| `research_and_score` | Research company and score lead |
| `find_similar` | Find leads similar to a profile |
| `enrich_and_outreach` | Full pipeline: find → enrich → score → outreach |

## Data Sources (57)

### Search Engines (5)
Google, Bing, DuckDuckGo, Brave, SearXNG

### Professional Networks (4)
LinkedIn, Xing, AngelList, Crunchbase

### Company Data (7)
OpenCorporates, SEC EDGAR, Companies House, Glassdoor, Indeed, Builtin, G2

### Local Business (8)
Google Maps, Yelp, Yellow Pages, Foursquare, BBB, Chamber of Commerce, Thumbtack, HomeAdvisor

### Social Media (8)
Twitter/X, GitHub, Reddit, Facebook, Instagram, TikTok, YouTube, Pinterest

### Developer (6)
GitHub Organizations, Stack Overflow, Dev.to, NPM, PyPI, Docker Hub

### Startup (5)
Product Hunt, Indie Hackers, Beta List, F6S, Gust

### Government (6)
SAM.gov, USASpending, Census, EU Register, Patents, Trademarks

### Education (4)
Google Scholar, ResearchGate, ORCID, Academia

### Email & Domain (5)
Hunter.io, Clearbit, WHOIS, DNS Lookup, SSL Certificate

### Events (4)
Eventbrite, Meetup, Luma, Conference Speakers

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KEELEAD_API_URL` | `http://localhost:3000` | KeeLead API base URL |
