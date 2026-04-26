// KeeLead — Email templates
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: "outreach" | "follow-up" | "re-engagement" | "introduction" | "thank-you"
  variables: string[]
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "cold-outreach-1",
    name: "Cold Outreach — Value First",
    subject: "Quick question about {{company}}'s {{topic}}",
    body: `Hi {{firstName}},

I noticed {{company}} is growing fast in the {{industry}} space — congrats on {{recentEvent}}.

I help companies like yours {{valueProp}}. We've helped similar companies {{socialProof}}.

Would you be open to a quick 15-minute call this week to explore if there's a fit?

Best,
{{senderName}}`,
    category: "outreach",
    variables: ["firstName", "company", "topic", "industry", "recentEvent", "valueProp", "socialProof", "senderName"],
  },
  {
    id: "cold-outreach-2",
    name: "Cold Outreach — Mutual Connection",
    subject: "{{mutualConnection}} suggested I reach out",
    body: `Hi {{firstName}},

{{mutualConnection}} mentioned you're working on some exciting things at {{company}} in the {{industry}} space.

I've been helping companies {{valueProp}} and thought there might be a good fit.

Would you be open to a brief chat?

Best,
{{senderName}}`,
    category: "outreach",
    variables: ["firstName", "mutualConnection", "company", "industry", "valueProp", "senderName"],
  },
  {
    id: "follow-up-1",
    name: "Follow-Up — Gentle Nudge",
    subject: "Re: Quick question about {{company}}'s {{topic}}",
    body: `Hi {{firstName}},

Just following up on my last email. I know things get busy.

If {{valueProp}} isn't a priority right now, no worries at all. But if it is, I'd love to share how we helped {{similarCompany}} achieve {{result}}.

Happy to work around your schedule.

Best,
{{senderName}}`,
    category: "follow-up",
    variables: ["firstName", "company", "topic", "valueProp", "similarCompany", "result", "senderName"],
  },
  {
    id: "follow-up-2",
    name: "Follow-Up — Case Study",
    subject: "How {{similarCompany}} solved {{painPoint}}",
    body: `Hi {{firstName}},

Thought you'd find this interesting — we recently helped {{similarCompany}} in the {{industry}} space:

• {{metric1}}
• {{metric2}}
• {{metric3}}

Given what you're doing at {{company}}, I think we could help you see similar results.

Worth a quick conversation?

Best,
{{senderName}}`,
    category: "follow-up",
    variables: ["firstName", "similarCompany", "painPoint", "industry", "metric1", "metric2", "metric3", "company", "senderName"],
  },
  {
    id: "introduction-1",
    name: "Introduction — New Team Member",
    subject: "Now your dedicated contact at {{senderCompany}}",
    body: `Hi {{firstName}},

I'm {{senderName}}, and I'll be your dedicated point of contact at {{senderCompany}} going forward.

I'd love to learn more about what you're working on at {{company}} and how we can better support your goals.

Would you have 15 minutes this week for a quick intro call?

Looking forward to connecting!

Best,
{{senderName}}`,
    category: "introduction",
    variables: ["firstName", "senderName", "senderCompany", "company"],
  },
  {
    id: "thank-you-1",
    name: "Thank You — Post Meeting",
    subject: "Great chatting, {{firstName}}!",
    body: `Hi {{firstName}},

Thanks for taking the time to chat today! I really enjoyed learning about {{company}}'s plans for {{topic}}.

As discussed, I'll {{nextSteps}}.

Let me know if you have any questions in the meantime.

Best,
{{senderName}}`,
    category: "thank-you",
    variables: ["firstName", "company", "topic", "nextSteps", "senderName"],
  },
]

export function renderTemplate(templateId: string, variables: Record<string, string>): { subject: string; body: string } | null {
  const template = EMAIL_TEMPLATES.find((t) => t.id === templateId)
  if (!template) return null

  let subject = template.subject
  let body = template.body

  for (const [key, value] of Object.entries(variables)) {
    subject = subject.replace(new RegExp(`{{${key}}}`, "g"), value)
    body = body.replace(new RegExp(`{{${key}}}`, "g"), value)
  }

  return { subject, body }
}
