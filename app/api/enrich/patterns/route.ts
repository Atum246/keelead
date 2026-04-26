import { NextResponse } from "next/server"
import { findEmailPatterns } from "@/lib/enrichment"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { domain, firstName, lastName } = body

    if (!domain || !firstName || !lastName) {
      return NextResponse.json(
        { error: "domain, firstName, and lastName are required" },
        { status: 400 }
      )
    }

    const patterns = findEmailPatterns(domain, firstName, lastName)
    return NextResponse.json({ domain, patterns, count: patterns.length })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to find email patterns" },
      { status: 500 }
    )
  }
}
