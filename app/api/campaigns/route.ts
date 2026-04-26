import { NextResponse } from "next/server"

export async function GET() {
  const campaigns = [
    { id: "1", name: "Q4 SaaS Outreach", status: "active", type: "email", targetLeads: 500, sentCount: 342, openRate: 45.2, replyRate: 12.3, enrolled: 450 },
    { id: "2", name: "Enterprise Decision Makers", status: "active", type: "multi", targetLeads: 200, sentCount: 156, openRate: 52.1, replyRate: 18.7, enrolled: 200 },
    { id: "3", name: "Startup Founders NYC", status: "paused", type: "email", targetLeads: 300, sentCount: 89, openRate: 38.4, replyRate: 8.9, enrolled: 89 },
    { id: "4", name: "Tech Conference Follow-up", status: "completed", type: "linkedin", targetLeads: 150, sentCount: 150, openRate: 61.3, replyRate: 22.1, enrolled: 150 },
  ]

  return NextResponse.json({ campaigns, total: campaigns.length })
}
