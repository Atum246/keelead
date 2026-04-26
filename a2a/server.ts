#!/usr/bin/env tsx
/**
 * KeeLead A2A Server — Agent-to-Agent Protocol
 * 
 * Implements Google's A2A protocol for agent interoperability.
 * Allows other AI agents to discover and use KeeLead's capabilities
 * as a first-class agent in multi-agent systems.
 * 
 * Usage:
 *   npx tsx a2a/server.ts
 *   # Serves on http://localhost:3001/.well-known/agent.json
 */

import http from "http"

const PORT = parseInt(process.env.A2A_PORT || "3001")
const API_URL = process.env.KEELEAD_API_URL || "http://localhost:3000"

// A2A Agent Card (discovery document)
const agentCard = {
  name: "KeeLead",
  description: "AI-powered lead generation agent. Finds leads, verifies emails, researches companies, and manages outreach campaigns across 25+ data sources.",
  url: `http://localhost:${PORT}`,
  version: "1.0.0",
  documentationUrl: "https://keelead.dev/docs",
  provider: {
    organization: "KeeLead",
    url: "https://keelead.dev",
  },
  capabilities: {
    streaming: true,
    pushNotifications: true,
    stateTransitionHistory: true,
  },
  authentication: {
    schemes: ["bearer"],
  },
  defaultInputModes: ["text/plain", "application/json"],
  defaultOutputModes: ["text/plain", "application/json"],
  skills: [
    {
      id: "lead_search",
      name: "Lead Search",
      description: "Search for business leads using natural language. Supports filtering by name, company, title, location, industry. Returns structured lead data with confidence scores.",
      tags: ["leads", "search", "prospecting"],
      examples: [
        "Find 50 SaaS founders in San Francisco",
        "Search for CTOs at fintech companies in New York",
        "Find restaurants in NYC with email addresses",
      ],
    },
    {
      id: "email_verification",
      name: "Email Verification",
      description: "Verify email addresses with 10-layer verification system. Checks syntax, domain, MX records, SMTP, disposable detection, and more. Returns score 0-100.",
      tags: ["email", "verification", "validation"],
      examples: [
        "Verify email john@example.com",
        "Bulk verify these emails: a@b.com, c@d.com",
      ],
    },
    {
      id: "company_research",
      name: "Company Research",
      description: "Deep research on any company: overview, tech stack, key people, funding history, competitors, news, and social media presence.",
      tags: ["research", "company", "intelligence"],
      examples: [
        "Research company Tesla",
        "Tell me about Stripe's tech stack and funding",
      ],
    },
    {
      id: "contact_finding",
      name: "Contact Finding",
      description: "Find contact information for specific people by name, company, title, or location. Searches across multiple data sources.",
      tags: ["contacts", "people", "finder"],
      examples: [
        "Find the CTO of Notion",
        "Find Sarah Chen's email at CloudSync",
      ],
    },
    {
      id: "lead_enrichment",
      name: "Lead Enrichment",
      description: "Enrich leads with additional data from multiple sources: email, phone, social profiles, firmographic, technographic data.",
      tags: ["enrichment", "data", "augmentation"],
      examples: [
        "Enrich this lead: john@techcorp.com",
        "Get more data on this company: techcorp.com",
      ],
    },
    {
      id: "intent_signals",
      name: "Intent Signals",
      description: "Track intent signals: job changes, hiring news, funding events, product launches, social mentions for companies.",
      tags: ["signals", "intent", "monitoring"],
      examples: [
        "Get intent signals for DataVault",
        "Track hiring signals at Nexus AI",
      ],
    },
    {
      id: "lead_scoring",
      name: "Lead Scoring",
      description: "AI-powered lead scoring (0-100) based on ICP fit, intent signals, engagement history, and firmographic data.",
      tags: ["scoring", "qualification", "AI"],
      examples: [
        "Score this lead against our ICP",
        "Which of these leads are most likely to convert?",
      ],
    },
    {
      id: "export",
      name: "Data Export",
      description: "Export leads in multiple formats: CSV, JSON, Excel, vCard, PDF. Filter by status, source, tags before export.",
      tags: ["export", "download", "data"],
      examples: [
        "Export all qualified leads to CSV",
        "Download leads from LinkedIn as Excel",
      ],
    },
  ],
}

// A2A Task Handler
async function handleTask(task: {
  id: string
  message: { parts: Array<{ type: string; text?: string }> }
}): Promise<unknown> {
  const userMessage = task.message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(" ")

  // Route to KeeLead API
  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    })
    const data = await res.json()

    return {
      id: task.id,
      status: { state: "completed" },
      artifacts: [
        {
          parts: [
            {
              type: "text",
              text: data.content || "Task completed",
            },
          ],
        },
      ],
    }
  } catch (error) {
    return {
      id: task.id,
      status: { state: "failed", message: { parts: [{ type: "text", text: `Error: ${error}` }] } },
    }
  }
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  // Agent Card discovery
  if (req.url === "/.well-known/agent.json") {
    res.writeHead(200)
    res.end(JSON.stringify(agentCard, null, 2))
    return
  }

  // A2A Task endpoint
  if (req.url === "/a2a/tasks/send" && req.method === "POST") {
    let body = ""
    req.on("data", (chunk) => (body += chunk))
    req.on("end", async () => {
      try {
        const task = JSON.parse(body)
        const result = await handleTask(task)
        res.writeHead(200)
        res.end(JSON.stringify(result))
      } catch (error) {
        res.writeHead(400)
        res.end(JSON.stringify({ error: "Invalid request" }))
      }
    })
    return
  }

  // Health check
  if (req.url === "/health") {
    res.writeHead(200)
    res.end(JSON.stringify({ status: "ok", agent: "KeeLead", version: "1.0.0" }))
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: "Not found" }))
})

server.listen(PORT, () => {
  console.log(`KeeLead A2A Server running on http://localhost:${PORT}`)
  console.log(`Agent Card: http://localhost:${PORT}/.well-known/agent.json`)
})
