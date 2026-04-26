// KeeLead — Webhook event types
export const WEBHOOK_EVENTS = {
  // Lead events
  "lead.created": "A new lead was created",
  "lead.updated": "A lead was updated",
  "lead.deleted": "A lead was deleted",
  "lead.enriched": "A lead was enriched with new data",
  "lead.scored": "A lead was scored against ICP",
  "lead.verified": "A lead's email was verified",

  // Email events
  "email.verified": "An email verification completed",
  "email.sent": "An email was sent via campaign",
  "email.opened": "An email was opened",
  "email.clicked": "A link in an email was clicked",
  "email.replied": "A reply was received",
  "email.bounced": "An email bounced",
  "email.unsubscribed": "A recipient unsubscribed",

  // Campaign events
  "campaign.created": "A new campaign was created",
  "campaign.started": "A campaign was started",
  "campaign.paused": "A campaign was paused",
  "campaign.completed": "A campaign completed",
  "campaign.failed": "A campaign failed",

  // Company events
  "company.researched": "A company research completed",
  "company.updated": "Company data was updated",

  // Signal events
  "signal.detected": "An intent signal was detected",
  "signal.job_change": "A job change signal was detected",
  "signal.funding": "A funding signal was detected",
  "signal.hiring": "A hiring signal was detected",

  // System events
  "source.enabled": "A data source was enabled",
  "source.disabled": "A data source was disabled",
  "export.completed": "An export completed",
  "batch.completed": "A batch operation completed",
} as const

export type WebhookEvent = keyof typeof WEBHOOK_EVENTS

export interface WebhookPayload {
  id: string
  event: WebhookEvent
  timestamp: string
  data: Record<string, unknown>
  source: string
}
