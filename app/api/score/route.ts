import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { lead, icp } = await request.json()

    // AI Lead Scoring
    let score = 50
    const breakdown: Record<string, number> = {}

    // Title match
    if (lead?.title) {
      const seniorTitles = ["ceo", "cto", "cfo", "vp", "director", "head", "founder", "co-founder"]
      if (seniorTitles.some((t) => lead.title.toLowerCase().includes(t))) {
        score += 15
        breakdown.titleMatch = 15
      }
    }

    // Industry match
    if (lead?.industry) {
      const hotIndustries = ["saas", "tech", "fintech", "ai", "healthcare", "ecommerce"]
      if (hotIndustries.some((i) => lead.industry.toLowerCase().includes(i))) {
        score += 10
        breakdown.industryMatch = 10
      }
    }

    // Company signal boost
    if (lead?.company) {
      score += 5
      breakdown.companyPresence = 5
    }

    // Location match
    if (lead?.location) {
      const hotLocations = ["san francisco", "new york", "austin", "seattle", "boston", "los angeles"]
      if (hotLocations.some((l) => lead.location.toLowerCase().includes(l))) {
        score += 5
        breakdown.locationMatch = 5
      }
    }

    // ICP match bonus
    if (icp) {
      if (icp.titles && lead?.title && icp.titles.some((t: string) => lead.title.toLowerCase().includes(t.toLowerCase()))) {
        score += 10
        breakdown.icpTitleMatch = 10
      }
      if (icp.industries && lead?.industry && icp.industries.includes(lead.industry)) {
        score += 5
        breakdown.icpIndustryMatch = 5
      }
    }

    score = Math.min(score, 100)

    return NextResponse.json({ score, breakdown, lead })
  } catch (error) {
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 })
  }
}
