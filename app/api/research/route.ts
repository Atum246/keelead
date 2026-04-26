import { NextRequest, NextResponse } from "next/server"
import { researchCompany } from "@/lib/research"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 })

    const result = await researchCompany(query)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to research company" }, { status: 500 })
  }
}
