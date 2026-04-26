import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo leads
  const leads = [
    { firstName: "Sarah", lastName: "Chen", email: "sarah@cloudsync.io", phone: "+1 415-555-0123", company: "CloudSync", title: "CEO", source: "LinkedIn", status: "new", score: 95, verified: true, tags: '["saas","founder"]' },
    { firstName: "James", lastName: "Wilson", email: "james@techcorp.com", phone: "+1 628-555-0456", company: "TechCorp", title: "CTO", source: "Crunchbase", status: "contacted", score: 88, verified: true, tags: '["tech","enterprise"]' },
    { firstName: "Emily", lastName: "Zhang", email: "emily@innovatelab.io", phone: "+1 510-555-0789", company: "InnovateLab", title: "VP Engineering", source: "GitHub", status: "qualified", score: 82, verified: false, tags: '["startup","ai"]' },
    { firstName: "Michael", lastName: "Brown", email: "michael@datavault.com", phone: "+1 650-555-0321", company: "DataVault", title: "Founder", source: "Web Search", status: "new", score: 91, verified: true, tags: '["security","founder"]' },
    { firstName: "Lisa", lastName: "Park", email: "lisa@nexusai.com", phone: "+1 408-555-0654", company: "Nexus AI", title: "Head of Growth", source: "LinkedIn", status: "converted", score: 97, verified: true, tags: '["ai","growth"]' },
    { firstName: "David", lastName: "Kim", email: "david@vertexinc.com", phone: "+1 212-555-0987", company: "Vertex Inc", title: "Director of Sales", source: "Yelp", status: "new", score: 74, verified: false, tags: '["sales","enterprise"]' },
    { firstName: "Jennifer", lastName: "Lee", email: "jen@apexdigital.com", phone: "+1 310-555-0147", company: "Apex Digital", title: "Marketing Manager", source: "Google Maps", status: "contacted", score: 85, verified: true, tags: '["marketing","digital"]' },
    { firstName: "Robert", lastName: "Taylor", email: "rob@horizontech.io", phone: "+1 617-555-0258", company: "Horizon Tech", title: "Engineering Lead", source: "GitHub", status: "new", score: 79, verified: true, tags: '["engineering","startup"]' },
  ]

  // Clear existing data first
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.setting.deleteMany()

  for (const lead of leads) {
    await prisma.lead.create({ data: lead })
  }
  console.log(`✅ Created ${leads.length} leads`)

  // Create demo campaigns
  const campaigns = [
    { name: "Q4 SaaS Outreach", description: "Target SaaS founders in Bay Area", status: "active", type: "email", targetLeads: 500, sentCount: 342, openRate: 45.2, replyRate: 12.3 },
    { name: "Enterprise Decision Makers", description: "CTOs and VPs at Fortune 500", status: "active", type: "multi", targetLeads: 200, sentCount: 156, openRate: 52.1, replyRate: 18.7 },
    { name: "Startup Founders NYC", description: "Early-stage founders in New York", status: "paused", type: "email", targetLeads: 300, sentCount: 89, openRate: 38.4, replyRate: 8.9 },
  ]

  for (const campaign of campaigns) {
    await prisma.campaign.create({ data: campaign })
  }
  console.log(`✅ Created ${campaigns.length} campaigns`)

  // Create demo conversation
  const conversation = await prisma.conversation.create({
    data: {
      title: "Welcome to KeeLead",
      messages: {
        create: [
          { role: "assistant", content: "Welcome to KeeLead! I'm your AI-powered lead generation assistant. Ask me to find leads, verify emails, or research companies." },
        ],
      },
    },
  })
  console.log("✅ Created demo conversation")

  // Create default settings
  const defaultSettings = [
    { key: "ai_provider", value: JSON.stringify({ provider: "openai", model: "gpt-4o-mini" }) },
    { key: "notifications", value: JSON.stringify({ email: true, browser: true, slack: false, discord: false }) },
    { key: "proxy", value: JSON.stringify({ enabled: false, url: "", rotation: false }) },
    { key: "compliance", value: JSON.stringify({ gdpr: true, canSpam: true, autoOptOut: true }) },
  ]

  for (const setting of defaultSettings) {
    await prisma.setting.create({ data: setting })
  }
  console.log("✅ Created default settings")

  console.log("\n🎉 Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
