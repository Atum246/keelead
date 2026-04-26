// Integrations - Webhooks, CRM sync, Google Sheets, Slack/Discord notifications

export interface WebhookConfig {
  url: string
  events: string[]
  secret?: string
  enabled: boolean
}

export interface CRMConfig {
  provider: "hubspot" | "salesforce" | "pipedrive" | "custom"
  apiKey: string
  syncDirection: "push" | "pull" | "bidirectional"
  fieldMapping: Record<string, string>
}

// Webhook System
export class WebhookManager {
  private webhooks: WebhookConfig[] = []

  async register(config: WebhookConfig): Promise<string> {
    const id = Math.random().toString(36).substring(7)
    this.webhooks.push(config)
    return id
  }

  async trigger(event: string, payload: Record<string, unknown>): Promise<void> {
    for (const webhook of this.webhooks) {
      if (webhook.enabled && webhook.events.includes(event)) {
        try {
          await fetch(webhook.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(webhook.secret ? { "X-Webhook-Secret": webhook.secret } : {}),
            },
            body: JSON.stringify({ event, payload, timestamp: new Date().toISOString() }),
          })
        } catch (error) {
          console.error(`Webhook failed for ${webhook.url}:`, error)
        }
      }
    }
  }

  async list(): Promise<WebhookConfig[]> {
    return this.webhooks
  }

  async remove(index: number): Promise<void> {
    this.webhooks.splice(index, 1)
  }
}

// CRM Sync - HubSpot
export class HubSpotSync {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async syncLead(lead: Record<string, unknown>): Promise<{ success: boolean; crmId?: string }> {
    // Would use HubSpot API
    return { success: true, crmId: "hs_" + Math.random().toString(36).substring(7) }
  }

  async pullLeads(limit?: number): Promise<Record<string, unknown>[]> {
    return []
  }

  async getContact(crmId: string): Promise<Record<string, unknown> | null> {
    return null
  }
}

// CRM Sync - Salesforce
export class SalesforceSync {
  private apiKey: string
  private instanceUrl: string

  constructor(apiKey: string, instanceUrl: string) {
    this.apiKey = apiKey
    this.instanceUrl = instanceUrl
  }

  async syncLead(lead: Record<string, unknown>): Promise<{ success: boolean; crmId?: string }> {
    return { success: true, crmId: "sf_" + Math.random().toString(36).substring(7) }
  }

  async pullLeads(limit?: number): Promise<Record<string, unknown>[]> {
    return []
  }
}

// Google Sheets Integration
export class GoogleSheetsIntegration {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async exportToSheet(
    spreadsheetId: string,
    sheetName: string,
    data: Record<string, unknown>[]
  ): Promise<{ success: boolean; rowsWritten: number }> {
    return { success: true, rowsWritten: data.length }
  }

  async importFromSheet(spreadsheetId: string, sheetName: string): Promise<Record<string, unknown>[]> {
    return []
  }
}

// Slack Notifications
export class SlackNotifier {
  private webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  async send(message: string, channel?: string): Promise<boolean> {
    try {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, channel }),
      })
      return true
    } catch {
      return false
    }
  }

  async sendLeadAlert(lead: { name: string; company: string; score: number }): Promise<boolean> {
    return this.send(
      `🎯 New lead: *${lead.name}* at *${lead.company}* (Score: ${lead.score})`
    )
  }

  async sendCampaignSummary(stats: { sent: number; opened: number; replied: number }): Promise<boolean> {
    return this.send(
      `📊 Campaign update: ${stats.sent} sent, ${stats.opened} opened (${((stats.opened / stats.sent) * 100).toFixed(1)}%), ${stats.replied} replied`
    )
  }
}

// Discord Notifications
export class DiscordNotifier {
  private webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  async send(content: string, embeds?: Array<{ title: string; description: string; color?: number }>): Promise<boolean> {
    try {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, embeds }),
      })
      return true
    } catch {
      return false
    }
  }
}

// Integration Registry
export const integrations = {
  webhooks: new WebhookManager(),
  hubspot: (apiKey: string) => new HubSpotSync(apiKey),
  salesforce: (apiKey: string, url: string) => new SalesforceSync(apiKey, url),
  googleSheets: (apiKey: string) => new GoogleSheetsIntegration(apiKey),
  slack: (webhookUrl: string) => new SlackNotifier(webhookUrl),
  discord: (webhookUrl: string) => new DiscordNotifier(webhookUrl),
}
