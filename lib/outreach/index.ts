// Email Sequence / Outreach Engine

export interface Sequence {
  id: string
  name: string
  steps: SequenceStep[]
  status: "draft" | "active" | "paused" | "completed"
  stats: SequenceStats
}

export interface SequenceStep {
  id: string
  type: "email" | "delay" | "condition" | "task"
  order: number
  subject?: string
  body?: string
  delayDays?: number
  condition?: string
  sendTime?: string // optimal send time
}

export interface SequenceStats {
  enrolled: number
  sent: number
  opened: number
  clicked: number
  replied: number
  bounced: number
  unsubscribed: number
}

// AI Email Writer
export async function generateEmail(
  context: {
    recipientName: string
    recipientCompany: string
    recipientTitle: string
    senderName: string
    senderCompany: string
    purpose: string
    tone?: "formal" | "casual" | "friendly"
  }
): Promise<{ subject: string; body: string }> {
  const tone = context.tone || "friendly"
  return {
    subject: `Quick question about ${context.recipientCompany}`,
    body: `Hi ${context.recipientName.split(" ")[0]},\n\nI noticed ${context.recipientCompany} is growing fast in the ${context.recipientTitle.includes("CTO") ? "technology" : "business"} space.\n\n${context.purpose}\n\nWould love to connect for a quick 10-minute chat.\n\nBest,\n${context.senderName}\n${context.senderCompany}`,
  }
}

// A/B Testing
export interface ABTest {
  id: string
  sequenceId: string
  variants: ABVariant[]
  winner?: string
  metric: "open_rate" | "reply_rate" | "click_rate"
}

export interface ABVariant {
  id: string
  name: string
  subject?: string
  body?: string
  percentage: number
  stats: { sent: number; opened: number; clicked: number; replied: number }
}

// Send Time Optimization
export function getOptimalSendTime(
  timezone: string,
  industry: string,
  title: string
): { hour: number; day: string } {
  // Best times based on research
  const bestTimes: Record<string, { hour: number; day: string }> = {
    "tech": { hour: 10, day: "Tuesday" },
    "finance": { hour: 8, day: "Wednesday" },
    "healthcare": { hour: 9, day: "Thursday" },
    "default": { hour: 10, day: "Tuesday" },
  }
  return bestTimes[industry.toLowerCase()] || bestTimes["default"]
}

// Sequence enrollment
export async function enrollLead(
  sequenceId: string,
  leadId: string,
  customVars?: Record<string, string>
): Promise<{ success: boolean; enrollmentId: string }> {
  return {
    success: true,
    enrollmentId: Math.random().toString(36).substring(7),
  }
}

// Unsubscribe handler
export async function handleUnsubscribe(email: string, sequenceId: string): Promise<void> {
  // Add to DNC list, remove from sequence
}
