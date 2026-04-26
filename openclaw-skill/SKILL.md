# KeeLead OpenClaw Skill

## Description
AI-powered lead generation platform. Find leads, verify emails, research companies through natural language.

## When to Use
- User asks to find leads, prospects, or contacts
- User wants to verify email addresses
- User wants to research a company
- User asks about lead generation, sales prospecting, or outreach

## How to Use

### Via MCP Tools (Recommended)
If KeeLead MCP server is configured, use these tools directly:
- `keelead_search_leads` — Search for leads
- `keelead_verify_email` — Verify emails
- `keelead_research_company` — Research companies
- `keelead_find_contact` — Find contacts
- `keelead_enrich_lead` — Enrich lead data
- `keelead_get_signals` — Get intent signals
- `keelead_score_lead` — Score leads
- `keelead_export_leads` — Export leads

### Via REST API
```bash
# Search leads
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"query": "Find SaaS founders in SF", "count": 10}'

# Verify email
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"emails": ["test@example.com"]}'

# Research company
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{"query": "Tesla"}'
```

### Via CLI
```bash
npx tsx /path/to/keelead/cli/index.ts chat "find 50 SaaS founders"
npx tsx /path/to/keelead/cli/index.ts verify john@example.com
npx tsx /path/to/keelead/cli/index.ts research Tesla
```

### Via Web UI
Open http://localhost:3000 for the full web interface with:
- AI Chat Interface
- Dashboard with analytics
- Lead management
- Campaign builder
- Pipeline (Kanban)
- And more

## Setup

1. Install KeeLead:
```bash
cd /path/to/keelead && npm install
```

2. Initialize database:
```bash
npx prisma db push && npx tsx prisma/seed.ts
```

3. Start the server:
```bash
npm run dev
```

4. (Optional) Start MCP server:
```bash
npx tsx mcp/server.ts
```

## Configuration
- Set `KEELEAD_API_URL` environment variable (default: http://localhost:3000)
- Configure AI providers in Settings → AI Models
- Enable/disable data sources in Settings → Data Sources

## Keywords
leads, prospects, email verification, company research, sales, outreach, CRM, lead generation, contacts, cold email
