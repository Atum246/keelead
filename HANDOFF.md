# KeeLead - Handoff Document
## Date: 2026-04-26
## Built By: Neo (AI Assistant) for John

---

## 🎯 What Is KeeLead?
KeeLead is an open-source, self-hosted AI-powered lead generation platform.
It's a free alternative to tools like Apollo.io, ZoomInfo, Clay, and Origami.chat.

## 📍 GitHub
https://github.com/Atum246/keelead

## 📍 Project Location
/root/.openclaw/workspace/keelead/

## 📊 Project Stats
- 175 files
- 15,500+ lines of TypeScript
- 62 data source plugins (11 categories)
- 16 pages (15 dashboard + chat)
- 16 API routes
- 19 UI components
- 19 lib modules

## 🏗️ What Was Built

### Pages (16)
1. `/` - Landing page with hero, features, CTA
2. `/chat` - ChatGPT-style AI chat interface (THE main feature)
3. `/dashboard` - Overview with stats, charts, activity feed
4. `/dashboard/leads` - Lead management table (sortable, filterable)
5. `/dashboard/pipeline` - Kanban board (drag & drop)
6. `/dashboard/campaigns` - Campaign management
7. `/dashboard/sequences` - Email drip sequence builder
8. `/dashboard/research` - Company deep research
9. `/dashboard/finder` - Contact finder
10. `/dashboard/verify` - Email verification (10-layer)
11. `/dashboard/signals` - Intent signals tracking
12. `/dashboard/analytics` - Performance dashboards
13. `/dashboard/export` - Export center (7 formats)
14. `/dashboard/compliance` - GDPR/CAN-SPAM tools
15. `/dashboard/settings` - Settings with tabs (AI models, MCP, webhooks, sources)
16. `/api/docs` - Interactive API documentation

### API Routes (16)
- /api/chat, /api/leads, /api/research, /api/verify, /api/export
- /api/settings, /api/conversations, /api/sources, /api/templates
- /api/enrich, /api/enrich/patterns, /api/score, /api/signals
- /api/analytics, /api/campaigns, /api/agents/functions

### Lib Modules (19)
- ai/ - Multi-provider AI (OpenAI, Claude, OpenRouter, NVIDIA, Ollama, etc.)
- lead-engine/ - Lead generation orchestration
- email/ - 10-layer email verification
- research/ - Company research engine
- enrichment/ - Waterfall enrichment
- signals/ - Intent signal tracking
- outreach/ - Email sequences
- analytics/ - Analytics engine
- compliance/ - GDPR/CAN-SPAM
- integrations/ - CRM/webhook integrations
- webhooks/ - Webhook system (25+ events, HMAC, retries)
- plugins/ - Plugin system (6 built-in plugins)
- templates/ - Email/search/export templates
- batch/ - Batch processor, job queue, scheduler
- cache/ - Cache layer with TTL/LRU
- agent/ - AI agent integration wrapper
- scraper/ - Web scraping utilities
- sources/ - 62 data source plugins
- db/ - Prisma database client

### Data Sources (62 plugins, 11 categories)
Search (5): Google, Bing, DuckDuckGo, Brave, SearXNG
Professional (4): LinkedIn, Xing, AngelList, Crunchbase
Company (7): OpenCorporates, SEC EDGAR, Companies House, Glassdoor, Indeed, Builtin, G2
Local (8): Google Maps, Yelp, Yellow Pages, Foursquare, BBB, Chamber, Thumbtack, HomeAdvisor
Social (8): Twitter, GitHub, Reddit, Facebook, Instagram, TikTok, YouTube, Pinterest
Developer (6): GitHub Orgs, Stack Overflow, Dev.to, NPM, PyPI, Docker Hub
Startup (5): Product Hunt, Indie Hackers, Beta List, F6S, Gust
Government (6): SAM.gov, USASpending, Census, EU Register, Patents, Trademarks
Education (4): Google Scholar, ResearchGate, ORCID, Academia
Email (5): Hunter.io, Clearbit, WHOIS, DNS, SSL Certs
Events (4): Eventbrite, Meetup, Luma, Conference Speakers

### MCP Server (mcp/server.ts)
10 tools for AI agent integration:
- keelead_search_leads, keelead_verify_email, keelead_research_company
- keelead_find_contact, keelead_enrich_lead, keelead_export_leads
- keelead_get_signals, keelead_email_pattern, keelead_list_sources, keelead_lead_score

Works with: OpenClaw, Cursor, Claude Code, Cline, any MCP agent

### Other Files
- cli/index.ts - CLI interface
- Dockerfile + docker-compose.yml - Docker support
- .env.example - Environment template
- prisma/schema.prisma - Database schema
- prisma/seed.ts - Demo data seeder
- public/logo.svg - Radar/K logo (blue-to-emerald gradient)
- README.md - 41KB comprehensive documentation
- CONTRIBUTING.md - Contribution guide

## 🔧 How To Run
cd /root/.openclaw/workspace/keelead
npm run dev
# Open http://localhost:3000

## ⚠️ Known Issues / Notes
- Build passes clean (npm run build succeeds)
- Some data sources are placeholder implementations (need real API integrations)
- MCP server structure is complete but needs testing with real agents
- Logo uses a radial gradient reference that may need fixing in SVG
- Settings page tabs were updated but may need UI polish

## 🎨 Design
- Theme: Pure black (#000000 bg, #0a0a0a cards)
- Accents: Electric blue (#3b82f6) + Emerald (#10b981)
- Font: Inter
- Components: shadcn/ui with dark theme
- Logo: Stylized "K" with radar/sonar waves

## 👤 User Info
- Name: John
- Wants: Emoji-heavy conversations 🔥✨
- Named the AI: Neo ⚡
- GitHub: Atum246
- Timezone: GMT+8

## 🚀 Next Steps (Potential)
- Add more real API integrations to data sources
- Browser extension (Chrome/Firefox)
- Mobile app
- Multi-user auth
- More email templates
- Automated outreach sequences
- Real-time collaboration
