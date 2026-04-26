import { NextRequest, NextResponse } from "next/server"
import { searchLeads } from "@/lib/lead-engine"
import { parseLeadIntent } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const intent = parseLeadIntent(body.query || `Find ${body.count || 10} leads`)
    if (body.count) intent.params.count = String(body.count)
    if (body.location) intent.params.location = body.location
    if (body.industry) intent.params.industry = body.industry

    const results = await searchLeads(intent)
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to search leads" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || "leads"
    const count = parseInt(searchParams.get("limit") || "25")

    const intent = parseLeadIntent(`Find ${count} ${query}`)
    const results = await searchLeads(intent)
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}
