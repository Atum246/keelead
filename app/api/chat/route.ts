import { NextRequest, NextResponse } from "next/server"
import { searchLeads } from "@/lib/lead-engine"
import { parseLeadIntent, LEAD_GEN_SYSTEM_PROMPT } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json()

    // Parse intent from message
    const intent = parseLeadIntent(message)

    // Handle different intents
    if (intent.type === "search") {
      const results = await searchLeads(intent)
      const leadCount = results.leads.length
      const sources = results.sources.join(", ")

      let content = `I found **${leadCount} leads** matching your query.\n\n`
      if (results.leads.length > 0) {
        content += `| Name | Company | Title | Email | Score |\n`
        content += `|------|---------|-------|-------|-------|\n`
        for (const lead of results.leads.slice(0, 15)) {
          const score = Math.round(lead.confidence * 100)
          content += `| ${lead.firstName} ${lead.lastName} | ${lead.company || "-"} | ${lead.title || "-"} | ${lead.email || "-"} | ${score}% |\n`
        }
        if (results.leads.length > 15) {
          content += `\n*...and ${results.leads.length - 15} more results*\n`
        }
      }
      content += `\n📊 Sources: ${sources}`

      return NextResponse.json({
        content,
        metadata: { leads: results.leads, total: results.total, sources: results.sources },
      })
    }

    if (intent.type === "research") {
      const { researchCompany } = await import("@/lib/research")
      const company = intent.params.company || intent.query.replace(/research|tell me about/gi, "").trim()
      const profile = await researchCompany(company)

      let content = `## ${profile.name} — Company Research\n\n`
      content += `**Industry:** ${profile.industry} | **Size:** ${profile.size} employees | **Founded:** ${profile.founded}\n`
      content += `**Headquarters:** ${profile.headquarters} | **Revenue:** ${profile.revenue}\n\n`
      content += `### Tech Stack\n${profile.techStack.join(", ")}\n\n`
      content += `### Key People\n`
      for (const person of profile.keyPeople.slice(0, 5)) {
        content += `- **${person.name}** — ${person.title}\n`
      }
      content += `\n### Funding\n`
      for (const round of profile.funding) {
        content += `- **${round.round}**: ${round.amount} (${round.date}) — ${round.investors.join(", ")}\n`
      }

      return NextResponse.json({ content, metadata: { company: profile } })
    }

    if (intent.type === "verify") {
      const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/)
      if (emailMatch) {
        const { verifyEmail } = await import("@/lib/email")
        const result = await verifyEmail(emailMatch[0])

        let content = `## Email Verification: \`${result.email}\`\n\n`
        content += `**Status:** ${result.status.toUpperCase()} | **Score:** ${result.score}/100\n\n`
        content += `### Verification Layers\n`
        for (const layer of result.layers) {
          const icon = layer.passed ? "✅" : "❌"
          content += `${icon} **${layer.name}** (Layer ${layer.layer}): ${layer.details}\n`
        }
        if (result.suggestion) {
          content += `\n💡 **Suggestion:** Did you mean \`${result.suggestion}\`?`
        }

        return NextResponse.json({ content, metadata: { verification: result } })
      }
    }

    // Default: AI-powered response
    const content = `I understand you're asking about: "${message}"\n\nHere's what I can help with:\n\n- **Search leads**: "Find 50 SaaS founders in San Francisco"\n- **Research companies**: "Research company Tesla"\n- **Verify emails**: "Verify email test@example.com"\n- **Find contacts**: "Find the CTO of Stripe"\n\nTry being more specific and I'll search across 25+ data sources for you!`

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { content: "Sorry, I encountered an error. Please try again." },
      { status: 500 }
    )
  }
}
