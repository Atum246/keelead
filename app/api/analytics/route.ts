import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    overview: {
      totalLeads: 12847,
      totalEmailsSent: 8432,
      openRate: 47.3,
      replyRate: 14.8,
      clickRate: 8.2,
      conversionRate: 3.4,
    },
    trends: {
      leads: 12.5,
      emails: 23.1,
      opens: 5.2,
      replies: -1.3,
    },
    sourcePerformance: [
      { source: "LinkedIn", leads: 4523, emails: 2345, opens: 1234, replies: 234, convRate: 5.2 },
      { source: "Web Search", leads: 3211, emails: 1890, opens: 945, replies: 156, convRate: 3.8 },
      { source: "Crunchbase", leads: 1934, emails: 1200, opens: 672, replies: 134, convRate: 4.5 },
      { source: "GitHub", leads: 1289, emails: 800, opens: 360, replies: 72, convRate: 2.9 },
      { source: "Google Maps", leads: 967, emails: 600, opens: 318, replies: 48, convRate: 3.1 },
    ],
    funnel: [
      { stage: "Total Leads", count: 12847, percentage: 100 },
      { stage: "Contacted", count: 8432, percentage: 65.6 },
      { stage: "Opened", count: 3989, percentage: 31.0 },
      { stage: "Replied", count: 1248, percentage: 9.7 },
      { stage: "Qualified", count: 514, percentage: 4.0 },
      { stage: "Converted", count: 437, percentage: 3.4 },
    ],
  })
}
