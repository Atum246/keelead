import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { company, type } = await request.json()

    const signals = [
      { id: "1", type: "job_change", title: `New hire at ${company}`, description: `Key position filled`, company, date: new Date().toISOString(), score: 85, source: "LinkedIn", actionable: true },
      { id: "2", type: "hiring", title: `${company} is hiring`, description: `New job postings detected`, company, date: new Date().toISOString(), score: 80, source: "Job Boards", actionable: true },
      { id: "3", type: "funding", title: `${company} funding activity`, description: `Potential funding detected`, company, date: new Date().toISOString(), score: 90, source: "Crunchbase", actionable: true },
      { id: "4", type: "news", title: `${company} in the news`, description: `Recent news mention`, company, date: new Date().toISOString(), score: 70, source: "News", actionable: false },
    ]

    const filtered = type ? signals.filter((s) => s.type === type) : signals

    return NextResponse.json({ signals: filtered, company, total: filtered.length })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get signals" }, { status: 500 })
  }
}
