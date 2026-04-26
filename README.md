<div align="center">

<img src="public/logo.svg" alt="KeeLead Logo" width="120" height="120">

# ⚡ KeeLead

### The Ultimate Open Source AI-Powered Lead Generation Engine

**Find leads. Verify emails. Research companies. Close deals.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green)](https://modelcontextprotocol.io/)
[![AI Agents](https://img.shields.io/badge/AI%20Agents-Ready-purple)](#-ai-agent-integration)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](#-docker)

[Features](#-features) • [Quick Start](#-quick-start) • [Data Sources](#-62-data-sources) • [AI Agents](#-ai-agent-integration) • [API](#-api-documentation) • [CLI](#-cli) • [Docker](#-docker) • [Architecture](#-architecture) • [Contributing](#-contributing)

---

**KeeLead** is a free, open-source, self-hosted lead generation platform that combines the power of AI with 62+ data sources to help you find leads, verify emails, research companies, and grow your business — all through a beautiful ChatGPT-like interface.

> 🆓 **Free forever.** No per-seat pricing. No credit limits. No vendor lock-in. Your data stays on your server.

</div>

---

## 📖 Table of Contents

- [Why KeeLead?](#-why-keelead)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Detailed Installation](#-detailed-installation)
- [Configuration](#-configuration)
- [62 Data Sources](#-62-data-sources)
- [AI Chat Interface](#-ai-chat-interface)
- [Dashboard](#-dashboard)
- [Lead Management](#-lead-management)
- [Email Verification](#-email-verification)
- [Company Research](#-company-research)
- [Contact Finder](#-contact-finder)
- [Campaign Management](#-campaign-management)
- [Email Sequences](#-email-sequences)
- [Pipeline (Kanban)](#-pipeline-kanban)
- [Intent Signals](#-intent-signals)
- [Analytics](#-analytics)
- [Export Center](#-export-center)
- [Compliance](#-compliance)
- [Settings](#-settings)
- [AI Agent Integration](#-ai-agent-integration)
- [MCP Server](#-mcp-server)
- [API Documentation](#-api-documentation)
- [CLI](#-cli)
- [Docker](#-docker)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Webhooks](#-webhooks)
- [Plugin System](#-plugin-system)
- [Templates](#-templates)
- [Batch Operations](#-batch-operations)
- [Caching](#-caching)
- [Security](#-security)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🤔 Why KeeLead?

### The Problem
- 💰 **Expensive**: Tools like ZoomInfo ($15K+/yr), Apollo ($49-$149/mo), Clay ($149-$800/mo)
- 🔒 **Closed source**: You don't own your data, vendor lock-in
- 🚫 **Rate limits**: Artificial caps on searches and exports
- 🤷 **No AI integration**: Can't use with your own AI agents
- 📊 **Fragmented**: Need 5+ tools for a complete lead gen workflow

### The Solution: KeeLead
- 🆓 **100% Free**: MIT licensed, use forever, no limits
- 🔓 **Open source**: Full source code, modify anything
- 🏠 **Self-hosted**: Your data never leaves your server
- 🤖 **AI-native**: Built-in MCP server for AI agent integration
- 🧩 **All-in-one**: 62 data sources, email verification, company research, campaigns, analytics — in one tool

### Who Is This For?
- 🏢 **Sales teams** looking for a free alternative to expensive lead databases
- 🚀 **Startup founders** who need leads but can't afford ZoomInfo
- 📊 **Marketing teams** doing outbound campaigns
- 💻 **Developers** who want to build on top of a lead gen platform
- 🤖 **AI engineers** who want lead gen tools for their agents
- 🔍 **Researchers** doing market research or competitive analysis
- 📧 **Recruiters** finding talent and verifying contact info

---

## ✨ Features

### 🤖 AI Chat Interface
- **ChatGPT/Claude-style interface** for natural language lead generation
- Ask questions like: *"Find me 50 SaaS founders in San Francisco"*
- Multi-provider AI support: OpenAI, Claude, OpenRouter, NVIDIA, Ollama, Groq, Mistral, Together AI, LM Studio, HuggingFace, custom endpoints
- Streaming responses with markdown, tables, and code blocks
- Conversation history with search
- Command suggestions
- Rich result cards with inline export

### 📊 Dashboard
- **15+ pages** with full dark theme
- Real-time stats and charts
- Lead quality visualization
- Source performance breakdown
- Campaign analytics
- Activity feed
- Quick actions

### 👥 Lead Management
- Sortable/filterable data table
- Columns: Name, Company, Title, Email, Phone, Source, Status, Score, Verified
- Bulk actions (export, delete, tag, enrich)
- Search and filter bar
- Lead detail view
- Custom tags and labels
- Status tracking (new → contacted → qualified → converted → lost)
- AI lead scoring (0-100)
- Smart deduplication with fuzzy matching

### 📌 Pipeline (Kanban)
- Drag-and-drop pipeline board
- Stages: New → Contacted → Qualified → Negotiating → Won / Lost
- Visual deal tracking
- Quick stage transitions
- Pipeline value calculation

### 📧 Email Verification
- **10-layer verification system**:
  1. ✅ Syntax validation (RFC 5322)
  2. ✅ Domain existence check
  3. ✅ MX record verification
  4. ✅ Disposable email detection (10K+ domain blocklist)
  5. ✅ Role-based email detection (info@, support@, sales@)
  6. ✅ Typo suggestion (Levenshtein distance)
  7. ✅ SMTP RCPT TO verification
  8. ✅ Catch-all detection
  9. ✅ Spam trap detection
  10. ✅ Free provider detection (Gmail, Yahoo, etc.)
- Score 0-100 with detailed breakdown
- Bulk CSV verification
- Upload and verify thousands of emails

### 🏢 Company Research
- Deep company profiles with one search
- Company overview, industry, size, revenue
- Tech stack detection
- Key people and leadership
- Funding history and investors
- Competitor analysis
- News and press aggregation
- Social media presence
- Job posting analysis
- Org chart estimation

### 🔍 Contact Finder
- Search by name, company, title, location
- Multi-source results with confidence scores
- Quick export
- Reverse email lookup
- Reverse phone lookup
- Social profile discovery

### 📨 Campaign Management
- Create and manage outreach campaigns
- Campaign cards with stats (sent, open rate, reply rate)
- Lead assignment
- Status tracking (draft, active, paused, completed)
- Multi-channel support (email, LinkedIn, phone, multi)

### 📬 Email Sequences
- Multi-step drip campaign builder
- Delay configuration between steps
- Conditional branching
- AI email writer
- Template library
- A/B testing support
- Open/click tracking

### 📡 Intent Signals
- Job change detection alerts
- Company news tracking
- Hiring signal detection
- Social mention monitoring
- Technology adoption signals
- Funding round alerts

### 📈 Analytics
- Dashboard overview with key metrics
- Source performance breakdown
- Campaign analytics (open rates, reply rates)
- Conversion funnel visualization
- Weekly/monthly trends
- Custom date ranges
- Export reports

### 📥 Export Center
- Export in 7 formats: **CSV, JSON, Excel (XLSX), vCard, PDF, XML, YAML**
- Filter before export
- Format preview
- Download history
- Batch export
- Custom field selection

### 🛡️ Compliance
- GDPR compliance tools
- CAN-SPAM compliance
- Do-Not-Contact (DNC) list management
- Audit log with full activity tracking
- Consent management
- Data retention policies
- Right to erasure support

### ⚙️ Settings
- **AI Model Configuration**: OpenAI, Claude, OpenRouter, NVIDIA, Ollama, Groq, Mistral, custom
- **Data Sources**: Enable/disable, set priorities and weights
- **Proxy Configuration**: HTTP/SOCKS5 proxy rotation
- **Notifications**: Browser, Slack, Discord, email
- **MCP Server**: Configuration and status
- **Webhooks**: Create and manage webhooks
- **Plugin Management**: Install and configure plugins
- **Theme**: Customize accent colors
- **API Keys**: Encrypted vault for all keys

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended: 20+)
- **npm**, **yarn**, or **pnpm**
- **Git**

### One-Command Setup

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/keelead.git
cd keelead
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open **http://localhost:3000** in your browser. That's it! 🎉

### First Steps
1. 🏠 Visit the **Landing Page** at `/` to see features
2. 💬 Click **Start Chatting** to use the AI interface at `/chat`
3. 📊 Visit the **Dashboard** at `/dashboard` for full management
4. ⚙️ Go to **Settings** at `/dashboard/settings` to configure AI providers
5. 🔍 Try searching: *"Find me 10 SaaS founders in New York"*

---

## 📦 Detailed Installation

### Method 1: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/keelead.git
cd keelead

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys (optional — works without them too)

# 4. Initialize database
npx prisma db push

# 5. Seed with demo data (optional)
npx tsx prisma/seed.ts

# 6. Start development server
npm run dev
```

### Method 2: Production Build

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/keelead.git
cd keelead
npm install

# 2. Build for production
npm run build

# 3. Start production server
npm start
```

### Method 3: Docker

```bash
# Quick start with Docker Compose
git clone https://github.com/YOUR_USERNAME/keelead.git
cd keelead
docker-compose up -d

# Or build manually
docker build -t keelead .
docker run -p 3000:3000 keelead
```

### Method 4: npx (Coming Soon)

```bash
npx create-keelead my-leads
cd my-leads
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# AI Providers (at least one recommended)
OPENAI_API_KEY=sk-...          # OpenAI (GPT-4o, GPT-4o-mini)
ANTHROPIC_API_KEY=sk-ant-...   # Anthropic (Claude)
OPENROUTER_API_KEY=sk-or-...   # OpenRouter (all models)
NVIDIA_API_KEY=nvapi-...       # NVIDIA NIM
OLLAMA_BASE_URL=http://localhost:11434  # Ollama (local)

# Optional: Search APIs
GOOGLE_SEARCH_API_KEY=...      # Google Custom Search
GOOGLE_SEARCH_CX=...           # Google Search Engine ID
BING_SEARCH_API_KEY=...        # Bing Web Search
BRAVE_SEARCH_API_KEY=...       # Brave Search

# Optional: Data Source APIs
HUNTER_API_KEY=...             # Hunter.io
CRUNCHBASE_API_KEY=...         # Crunchbase
CLEARBIT_API_KEY=...           # Clearbit

# Optional: Proxy
PROXY_URL=                     # HTTP/SOCKS5 proxy URL
PROXY_ROTATION=false           # Enable proxy rotation

# Optional: Notifications
SLACK_WEBHOOK_URL=...          # Slack notifications
DISCORD_WEBHOOK_URL=...        # Discord notifications
```

### AI Provider Setup

#### OpenAI (Recommended)
1. Go to https://platform.openai.com/api-keys
2. Create an API key
3. Add to `.env`: `OPENAI_API_KEY=sk-...`

#### Anthropic Claude
1. Go to https://console.anthropic.com/
2. Create an API key
3. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

#### OpenRouter (Access to 100+ models)
1. Go to https://openrouter.ai/keys
2. Create an API key
3. Add to `.env`: `OPENROUTER_API_KEY=sk-or-...`

#### Ollama (Local AI — 100% Private)
1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama3.1`
3. KeeLead auto-detects Ollama at `http://localhost:11434`

#### NVIDIA NIM
1. Go to https://build.nvidia.com/
2. Get your API key
3. Add to `.env`: `NVIDIA_API_KEY=nvapi-...`

---

## 📡 62 Data Sources

KeeLead ships with **62 modular data source plugins** across **11 categories**. Each source is a separate file that can be enabled, disabled, or extended.

### 🔍 Search Engines (5 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| Google Custom Search | Yes | 100/day | Google search results |
| Bing Web Search | Yes | 1000/month | Microsoft Bing results |
| DuckDuckGo | No | Unlimited | Privacy-focused search |
| Brave Search | Yes | 2000/month | Independent search engine |
| SearXNG | No | Unlimited | Self-hosted meta search |

### 💼 Professional Networks (4 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| LinkedIn | No | Public data | Professional profiles |
| Xing | No | Public data | European professional network |
| AngelList | No | Public data | Startup founders & jobs |
| Crunchbase | Yes | 200/month | Startup data & funding |

### 🏢 Company Data (7 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| OpenCorporates | No | Unlimited | 140+ country registries |
| SEC EDGAR | No | Unlimited | US public company filings |
| Companies House | No | Unlimited | UK company registry |
| Glassdoor | No | Public data | Company reviews & salaries |
| Indeed | No | Public data | Job postings & company data |
| Builtin | No | Public data | Tech company directory |
| G2 | No | Public data | Software reviews & companies |

### 📍 Local Business (8 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| Google Maps/Places | Yes | $200 credit | Local business listings |
| Yelp | Yes | 5000/day | Restaurant & local business |
| Yellow Pages | No | Public data | Business directory |
| Foursquare | Yes | 100K free | Places & venues |
| BBB | No | Public data | Better Business Bureau |
| Chamber of Commerce | No | Public data | Local business directories |
| Thumbtack | No | Public data | Local service providers |
| HomeAdvisor | No | Public data | Home services directory |

### 📱 Social Media (8 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| Twitter/X | No | Public data | Public profiles & bios |
| GitHub | No | 5000/hour | Developer profiles & orgs |
| Reddit | No | 60/minute | User profiles & communities |
| Facebook | No | Public data | Business pages |
| Instagram | No | Public data | Business profiles |
| TikTok | No | Public data | Creator profiles |
| YouTube | Yes | 10K units/day | Channel data |
| Pinterest | No | Public data | Business accounts |

### 💻 Developer Platforms (6 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| GitHub Organizations | No | 5000/hour | Company orgs on GitHub |
| Stack Overflow | No | 10K/day | Developer Q&A profiles |
| Dev.to | No | 30/30sec | Developer community |
| NPM | No | Unlimited | Node.js package authors |
| PyPI | No | Unlimited | Python package authors |
| Docker Hub | No | Limited | Container publishers |

### 🚀 Startup Platforms (5 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| Product Hunt | No | Public data | Makers & products |
| Indie Hackers | No | Public data | Indie founder profiles |
| Beta List | No | Public data | Startup directory |
| F6S | No | Public data | Startup community |
| Gust | No | Public data | Startup platform |

### 🏛️ Government & Public (6 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| SAM.gov | Yes | Free | US government contractors |
| USASpending | No | Unlimited | US government spending |
| US Census | No | Unlimited | Census business data |
| EU Register | No | Unlimited | EU transparency register |
| USPTO Patents | No | Unlimited | Patent database |
| USPTO Trademarks | No | Unlimited | Trademark database |

### 🎓 Education & Research (4 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| Google Scholar | No | Public data | Academic publications |
| ResearchGate | No | Public data | Researcher profiles |
| ORCID | No | Unlimited | Researcher IDs |
| Academia.edu | No | Public data | Academic profiles |

### 📧 Email & Domain (5 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| Hunter.io | Yes | 25/month | Email finder & verifier |
| Clearbit | Yes | Limited | Data enrichment |
| WHOIS | No | Unlimited | Domain registration data |
| DNS Lookup | No | Unlimited | MX, TXT, A records |
| SSL Certificates | No | Unlimited | Certificate transparency |

### 🎪 Events (4 sources)
| Source | API Required | Free Tier | Description |
|--------|-------------|-----------|-------------|
| Eventbrite | Yes | Unlimited | Events & attendees |
| Meetup | Yes | Limited | Groups & members |
| Luma | No | Public data | Event platform |
| Conference Speakers | No | Public data | Speaker directories |

### Adding Custom Sources

Create a new file in `lib/sources/your-category/your-source.ts`:

```typescript
import { BaseSource } from '../base'
import { Lead, SourceSearchOptions } from '../types'

export class YourSource extends BaseSource {
  id = 'your-source'
  name = 'Your Source'
  category = 'custom'
  requiresApiKey = true
  rateLimit = 60 // requests per minute

  async search(query: string, options?: SourceSearchOptions): Promise<Lead[]> {
    // Your implementation
    return []
  }

  async getCompany(domain: string) {
    // Company lookup
    return null
  }

  async getContact(email: string) {
    // Contact lookup
    return null
  }
}
```

Register it in `lib/sources/index.ts` and you're done!

---

## 💬 AI Chat Interface

The chat interface is the heart of KeeLead. It's a beautiful, ChatGPT-like experience where you can ask for leads in natural language.

### Example Queries

```
🔍 "Find me 50 SaaS founders in San Francisco"
📧 "Verify these emails: john@example.com, sarh@techco.io"
🏢 "Research Tesla and find their engineering leadership"
📍 "Find restaurants in NYC with email addresses"
💼 "Get me VP of Sales at Fortune 500 companies"
🚀 "Show me YC startups that raised Series A this year"
🔬 "Find developers who maintain popular React libraries"
📊 "Compare the tech stacks of Stripe vs Square"
```

### Chat Features
- 💬 Streaming responses
- 📊 Rich result cards with tables
- 📥 Inline export buttons
- 🔄 Regenerate responses
- 📋 Copy to clipboard
- 💾 Conversation history
- 🔍 Search conversations
- ⌨️ Keyboard shortcuts

---

## 🤖 AI Agent Integration

KeeLead is designed to work seamlessly with AI agents. It provides a **Model Context Protocol (MCP) server** that any AI agent can connect to.

### Supported AI Agents

| Agent | Status | Setup |
|-------|--------|-------|
| ⚡ **OpenClaw** | ✅ Ready | See [MCP Setup](#mcp-setup) |
| 🖥️ **Cursor** | ✅ Ready | See [MCP Setup](#mcp-setup) |
| 🧠 **Claude Code** | ✅ Ready | See [MCP Setup](#mcp-setup) |
| 🔧 **Cline** | ✅ Ready | See [MCP Setup](#mcp-setup) |
| 🌐 **Any MCP Agent** | ✅ Ready | Connect to `mcp/server.ts` |

### MCP Tools Available

| Tool | Description |
|------|-------------|
| `keelead_search_leads` | Search for leads with natural language |
| `keelead_verify_email` | Verify an email address |
| `keelead_research_company` | Deep research on a company |
| `keelead_find_contact` | Find contact information |
| `keelead_enrich_lead` | Enrich a lead with more data |
| `keelead_export_leads` | Export leads to various formats |
| `keelead_get_signals` | Get intent signals for a company |
| `keelead_email_pattern` | Find email patterns for a domain |
| `keelead_list_sources` | List available data sources |
| `keelead_lead_score` | Score a lead against ICP |

### MCP Setup

#### OpenClaw
Add to your OpenClaw config:
```json
{
  "mcp": {
    "servers": {
      "keelead": {
        "command": "npx",
        "args": ["tsx", "/path/to/keelead/mcp/server.ts"]
      }
    }
  }
}
```

#### Cursor
Add to `.cursor/mcp.json`:
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

#### Claude Code
```bash
claude mcp add keelead -- npx tsx /path/to/keelead/mcp/server.ts
```

#### Cline
Add to Cline MCP settings:
```json
{
  "keelead": {
    "command": "npx",
    "args": ["tsx", "/path/to/keelead/mcp/server.ts"]
  }
}
```

---

## 📡 API Documentation

KeeLead provides a comprehensive REST API with interactive documentation.

### Interactive Docs
Visit **http://localhost:3000/api/docs** for the full interactive API documentation.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send chat message, get AI response |
| `/api/leads` | GET/POST | Search and retrieve leads |
| `/api/research` | POST | Research a company |
| `/api/verify` | POST | Verify email addresses |
| `/api/export` | POST/GET | Export leads |
| `/api/settings` | GET/POST | Manage settings |
| `/api/conversations` | GET/POST/DELETE | Manage conversations |
| `/api/sources` | GET | List data sources |
| `/api/templates` | GET | Get templates |
| `/api/enrich` | POST | Enrich lead data |
| `/api/enrich/patterns` | POST | Find email patterns |
| `/api/score` | POST | Score a lead |
| `/api/signals` | GET | Get intent signals |
| `/api/analytics` | GET | Get analytics data |
| `/api/campaigns` | GET/POST | Manage campaigns |
| `/api/agents/functions` | GET | Agent function definitions |

### Example: Search Leads

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"query": "SaaS founders in San Francisco", "limit": 50}'
```

### Example: Verify Email

```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Example: Research Company

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{"company": "Tesla"}'
```

---

## 🖥️ CLI

KeeLead includes a powerful CLI for terminal users.

### Commands

```bash
# Natural language lead search
npx tsx cli/index.ts chat "find 50 SaaS founders in SF"

# Verify an email
npx tsx cli/index.ts verify john@example.com

# Research a company
npx tsx cli/index.ts research Tesla

# Export leads
npx tsx cli/index.ts export --format csv --filter "score>80"

# Start web UI
npx tsx cli/index.ts serve

# Show status
npx tsx cli/index.ts status

# List data sources
npx tsx cli/index.ts sources

# Batch verify emails from CSV
npx tsx cli/index.ts batch-verify emails.csv
```

### CLI Options

```bash
npx tsx cli/index.ts [command] [options]

Commands:
  chat <query>           Natural language lead search
  verify <email>         Verify an email address
  research <company>     Research a company
  export [options]       Export leads
  serve                  Start web UI
  status                 Show system status
  sources                List available data sources
  batch-verify <file>    Batch verify emails from CSV
  config <key> <value>   Set configuration

Options:
  --format               Export format (csv, json, xlsx, vcard, pdf)
  --filter               Filter expression
  --limit                Max results
  --output               Output file path
  --verbose              Enable verbose logging
```

---

## 🐳 Docker

### Quick Start

```bash
docker-compose up -d
```

### Docker Compose

```yaml
version: '3.8'
services:
  keelead:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/prisma
      - ./.env:/app/.env
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Build & Run

```bash
# Build image
docker build -t keelead .

# Run container
docker run -d \
  --name keelead \
  -p 3000:3000 \
  -v ./data:/app/prisma \
  -v ./.env:/app/.env \
  keelead
```

### Environment Variables in Docker

```bash
docker run -d \
  --name keelead \
  -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  keelead
```

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      KeeLead Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Web UI   │  │ CLI      │  │ MCP      │  │ REST API │   │
│  │ (Next.js)│  │ (Ink)    │  │ Server   │  │ (Routes) │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │          │
│  ┌────┴──────────────┴──────────────┴──────────────┴─────┐  │
│  │                    Core Engine                          │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  AI Engine  │ Lead Engine │ Email Verifier │ Research   │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Enrichment │ Signals     │ Outreach      │ Analytics  │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Webhooks   │ Plugins     │ Templates     │ Batch      │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Cache      │ Compliance  │ Integrations  │ Export     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              62 Data Source Plugins                      │  │
│  ├────────┬────────┬────────┬────────┬────────┬──────────┤  │
│  │ Search │ Social │Company │ Local  │ Email  │ Startup  │  │
│  │  (5)   │  (8)   │  (7)   │  (8)   │  (5)   │   (5)    │  │
│  ├────────┼────────┼────────┼────────┼────────┼──────────┤  │
│  │ Govt   │ Edu    │Events  │Developer│Prof.  │          │  │
│  │  (6)   │  (4)   │  (4)   │  (6)   │  (4)   │          │  │
│  └────────┴────────┴────────┴────────┴────────┴──────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              SQLite Database (Prisma ORM)                │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Query → AI Parser → Source Manager → 62 Sources → Results
                                    ↓
                              Deduplication → Scoring → Response
                                    ↓
                              Database ← Export / CRM / Webhook
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | Full-stack React framework |
| **Language** | TypeScript 5.7 | Type-safe code |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **Components** | shadcn/ui | Beautiful UI components |
| **Database** | SQLite | Lightweight, portable |
| **ORM** | Prisma 5.22 | Type-safe database access |
| **Charts** | Recharts | Beautiful charts |
| **Icons** | Lucide React | 1000+ icons |
| **AI** | Multi-provider | OpenAI, Claude, etc. |
| **Markdown** | react-markdown | Rich text rendering |
| **Validation** | Zod | Schema validation |
| **Docker** | Docker + Compose | Containerization |

---

## 📁 Project Structure

```
keelead/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── chat/page.tsx             # AI chat interface
│   ├── dashboard/                # Dashboard pages
│   │   ├── page.tsx              # Overview
│   │   ├── leads/page.tsx        # Lead management
│   │   ├── pipeline/page.tsx     # Kanban pipeline
│   │   ├── campaigns/page.tsx    # Campaign management
│   │   ├── sequences/page.tsx    # Email sequences
│   │   ├── research/page.tsx     # Company research
│   │   ├── finder/page.tsx       # Contact finder
│   │   ├── verify/page.tsx       # Email verification
│   │   ├── signals/page.tsx      # Intent signals
│   │   ├── analytics/page.tsx    # Analytics
│   │   ├── export/page.tsx       # Export center
│   │   ├── compliance/page.tsx   # Compliance
│   │   ├── settings/page.tsx     # Settings
│   │   └── layout.tsx            # Dashboard layout
│   └── api/                      # API routes
│       ├── chat/route.ts         # Chat endpoint
│       ├── leads/route.ts        # Leads CRUD
│       ├── research/route.ts     # Company research
│       ├── verify/route.ts       # Email verification
│       ├── export/route.ts       # Export endpoint
│       ├── settings/route.ts     # Settings CRUD
│       ├── conversations/route.ts # Conversations
│       ├── sources/route.ts      # Data sources
│       ├── templates/route.ts    # Templates
│       ├── enrich/route.ts       # Lead enrichment
│       ├── score/route.ts        # Lead scoring
│       ├── signals/route.ts      # Intent signals
│       ├── analytics/route.ts    # Analytics
│       ├── campaigns/route.ts    # Campaigns
│       ├── agents/functions/     # Agent function defs
│       └── docs/page.tsx         # API documentation
├── components/ui/                # 19 UI components
├── lib/                          # Core libraries
│   ├── ai/                       # Multi-provider AI
│   ├── lead-engine/              # Lead generation engine
│   ├── email/                    # 10-layer email verification
│   ├── research/                 # Company research engine
│   ├── enrichment/               # Waterfall enrichment
│   ├── signals/                  # Intent signal tracking
│   ├── outreach/                 # Email sequences
│   ├── analytics/                # Analytics engine
│   ├── compliance/               # GDPR/CAN-SPAM
│   ├── integrations/             # Webhooks, CRM, etc.
│   ├── webhooks/                 # Webhook system
│   ├── plugins/                  # Plugin system
│   ├── templates/                # Email/search/export templates
│   ├── batch/                    # Batch operations
│   ├── cache/                    # Caching layer
│   ├── agent/                    # AI agent integration
│   ├── scraper/                  # Web scraping utilities
│   ├── sources/                  # 62 data source plugins
│   │   ├── search/               # (5 sources)
│   │   ├── social/               # (8 sources)
│   │   ├── company/              # (7 sources)
│   │   ├── local/                # (8 sources)
│   │   ├── email/                # (5 sources)
│   │   ├── startup/              # (5 sources)
│   │   ├── government/           # (6 sources)
│   │   ├── education/            # (4 sources)
│   │   ├── events/               # (4 sources)
│   │   ├── developer/            # (6 sources)
│   │   └── professional/         # (4 sources)
│   ├── db/                       # Database client
│   └── utils.ts                  # Utilities
├── cli/                          # CLI interface
├── mcp/                          # MCP server
│   ├── server.ts                 # MCP server implementation
│   └── README.md                 # MCP setup guide
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Demo data seeder
│   └── keelead.db                # SQLite database
├── public/                       # Static assets
│   ├── logo.svg                  # KeeLead logo
│   └── favicon.svg               # Favicon
├── Dockerfile                    # Docker build
├── docker-compose.yml            # Docker Compose
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── next.config.js                # Next.js config
├── .env.example                  # Environment template
├── .env                          # Environment (local)
├── LICENSE                       # MIT License
└── README.md                     # This file
```

---

## 🗄️ Database Schema

### Lead
```prisma
model Lead {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String?
  phone       String?
  company     String?
  title       String?
  website     String?
  linkedin    String?
  location    String?
  source      String?
  status      String   @default("new")
  score       Int      @default(0)
  verified    Boolean  @default(false)
  tags        String?  // JSON array
  notes       String?
  metadata    String?  // JSON object
  campaignId  String?
  campaign    Campaign?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Campaign
```prisma
model Campaign {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("draft")
  type        String   @default("email")
  targetLeads Int      @default(0)
  sentCount   Int      @default(0)
  openRate    Float    @default(0)
  replyRate   Float    @default(0)
  leads       Lead[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Conversation & Message
```prisma
model Conversation {
  id        String    @id @default(cuid())
  title     String?
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Message {
  id             String       @id @default(cuid())
  role           String       // user, assistant, system
  content        String
  conversationId String
  conversation   Conversation @relation(...)
  metadata       String?      // JSON for results
  createdAt      DateTime     @default(now())
}
```

---

## 🪝 Webhooks

KeeLead supports webhooks for real-time event notifications.

### Event Types (25+)

| Event | Description |
|-------|-------------|
| `lead.created` | New lead added |
| `lead.updated` | Lead information updated |
| `lead.deleted` | Lead removed |
| `lead.scored` | Lead score calculated |
| `lead.enriched` | Lead enriched with new data |
| `email.verified` | Email verification completed |
| `email.valid` | Email verified as valid |
| `email.invalid` | Email verified as invalid |
| `campaign.created` | New campaign created |
| `campaign.started` | Campaign started |
| `campaign.completed` | Campaign completed |
| `research.completed` | Company research finished |
| `export.completed` | Export finished |
| `signal.detected` | Intent signal detected |
| `batch.completed` | Batch operation finished |
| And more... | |

### Webhook Configuration

```bash
# Via Settings UI
Dashboard → Settings → Webhooks → Add Webhook

# Via API
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "webhook_myapp",
    "value": {
      "url": "https://your-app.com/webhook",
      "events": ["lead.created", "email.verified"],
      "secret": "your-hmac-secret"
    }
  }'
```

---

## 🔌 Plugin System

Extend KeeLead with custom plugins.

### Built-in Plugins (6)

| Plugin | Description |
|--------|-------------|
| `dedup` | Automatic lead deduplication |
| `scoring` | AI-powered lead scoring |
| `enrichment` | Auto-enrichment on lead creation |
| `notifications` | Send notifications on events |
| `logging` | Detailed activity logging |
| `analytics` | Track source performance |

### Creating a Plugin

```typescript
import { Plugin, PluginContext } from '../lib/plugins/plugin-interface'

export class MyPlugin implements Plugin {
  id = 'my-plugin'
  name = 'My Plugin'
  version = '1.0.0'

  async onLeadCreated(ctx: PluginContext, lead: any) {
    // Your logic here
  }

  async onEmailVerified(ctx: PluginContext, result: any) {
    // Your logic here
  }
}
```

---

## 📧 Templates

### Email Templates (6)
- Cold outreach
- Follow-up
- Introduction
- Referral
- Re-engagement
- Thank you

### Search Templates (8)
- SaaS founders
- Enterprise CTOs
- Local businesses
- Startup employees
- GitHub developers
- Conference speakers
- Job seekers
- Industry experts

### Export Formats (7)
- CSV
- JSON
- Excel (XLSX)
- vCard (VCF)
- PDF
- XML
- YAML

---

## 🔒 Security

- **Self-hosted**: Your data never leaves your server
- **No tracking**: Zero third-party analytics
- **API key vault**: Encrypted storage for all keys
- **Audit log**: Full activity tracking
- **GDPR compliant**: Built-in compliance tools
- **CAN-SPAM compliant**: Unsubscribe management
- **Rate limiting**: Per-source rate limiting
- **Proxy support**: HTTP/SOCKS5 proxy rotation
- **User agent rotation**: Randomized user agents
- **Request caching**: Avoid redundant API calls
- **Local-first**: SQLite database, no cloud dependency

---

## ⚡ Performance

- **SQLite**: Zero-config, embedded database
- **Prisma ORM**: Type-safe, optimized queries
- **Next.js SSG**: Pre-rendered static pages
- **Code splitting**: Automatic per-page bundles
- **Caching**: Built-in cache layer with TTL/LRU
- **Batch processing**: Handle large operations efficiently
- **Streaming**: Real-time AI responses
- **Lazy loading**: Components loaded on demand

---

## 🔧 Troubleshooting

### Common Issues

#### "AI provider not configured"
→ Go to Settings → AI Models and add at least one API key

#### "Database not found"
→ Run `npx prisma db push` to create the database

#### "Port 3000 already in use"
→ Change port: `PORT=3001 npm run dev`

#### "Build fails"
→ Clear cache: `rm -rf .next node_modules && npm install && npm run build`

#### "MCP server not connecting"
→ Ensure `npx tsx` is available: `npm install -g tsx`

### Getting Help

1. Check the [Issues](https://github.com/YOUR_USERNAME/keelead/issues) page
2. Search existing issues
3. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)

---

## 🗺️ Roadmap

### v2.1 (Next)
- [ ] Browser extension (Chrome/Firefox)
- [ ] Real-time collaboration
- [ ] Voice interface (speech-to-text)
- [ ] Mobile app (React Native)
- [ ] More AI providers (Gemini, Cohere, etc.)

### v3.0 (Future)
- [ ] Multi-user support with authentication
- [ ] Team workspaces
- [ ] Advanced analytics dashboard
- [ ] CRM native integrations (Salesforce, HubSpot)
- [ ] Automated outreach sequences
- [ ] AI-powered lead nurturing
- [ ] White-label support

---

## 🤝 Contributing

We welcome contributions of all kinds!

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/keelead.git
   ```
3. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make** your changes
5. **Test** thoroughly
   ```bash
   npm run build
   npm run lint
   ```
6. **Commit** with a clear message
   ```bash
   git commit -m "Add: amazing feature description"
   ```
7. **Push** to your fork
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Create** a Pull Request

### Contribution Ideas

- 📡 Add new data source plugins
- 🎨 Improve UI/UX
- 📝 Add email templates
- 🐛 Fix bugs
- 📖 Improve documentation
- 🧪 Add tests
- 🌐 Add translations
- ⚡ Performance improvements

### Code Style

- TypeScript with strict types
- ESLint + Prettier formatting
- Conventional commits
- Component-based architecture
- Comprehensive JSDoc comments

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

```
MIT License

Copyright (c) 2026 KeeLead

Permission is free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Next.js](https://nextjs.org/) — The React Framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful components
- [Prisma](https://www.prisma.io/) — Next-generation ORM
- [Lucide](https://lucide.dev/) — Beautiful icons
- [Recharts](https://recharts.org/) — Composable charting library
- [Model Context Protocol](https://modelcontextprotocol.io/) — AI agent integration

Inspired by:
- [Clay](https://clay.com/) — Data enrichment workflows
- [Apollo.io](https://apollo.io/) — Sales intelligence platform
- [ZoomInfo](https://zoominfo.com/) — B2B database
- [Hunter.io](https://hunter.io/) — Email finder

---

<div align="center">

**[⬆ Back to top](#-keelead)**

---

Made with ⚡ by the KeeLead Community

**Star ⭐ this repo if you find it useful!**

</div>
