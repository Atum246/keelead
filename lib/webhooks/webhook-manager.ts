// KeeLead — Webhook Manager: Create, manage, and fire webhooks
import type { WebhookEvent, WebhookPayload } from "./event-types"
import { WEBHOOK_EVENTS } from "./event-types"
import { deliverWebhook, type WebhookEndpoint, type DeliveryResult } from "./delivery"

export class WebhookManager {
  private endpoints: Map<string, WebhookEndpoint> = new Map()
  private deliveryLog: Array<{ endpoint: string; payload: WebhookPayload; result: DeliveryResult }> = []

  /** Create a new webhook endpoint */
  create(url: string, events: string[], secret?: string): WebhookEndpoint {
    const id = `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const endpoint: WebhookEndpoint = {
      id,
      url,
      secret,
      events,
      enabled: true,
      createdAt: new Date().toISOString(),
      failureCount: 0,
    }
    this.endpoints.set(id, endpoint)
    return endpoint
  }

  /** Update a webhook endpoint */
  update(id: string, updates: Partial<Pick<WebhookEndpoint, "url" | "events" | "enabled" | "secret">>): WebhookEndpoint | null {
    const endpoint = this.endpoints.get(id)
    if (!endpoint) return null
    Object.assign(endpoint, updates)
    return endpoint
  }

  /** Delete a webhook endpoint */
  delete(id: string): boolean {
    return this.endpoints.delete(id)
  }

  /** Get all endpoints */
  list(): WebhookEndpoint[] {
    return Array.from(this.endpoints.values())
  }

  /** Get a specific endpoint */
  get(id: string): WebhookEndpoint | undefined {
    return this.endpoints.get(id)
  }

  /** Fire a webhook event */
  async fire(event: WebhookEvent, data: Record<string, unknown>): Promise<DeliveryResult[]> {
    const payload: WebhookPayload = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      event,
      timestamp: new Date().toISOString(),
      data,
      source: "keelead",
    }

    const matching = this.list().filter(
      (ep) => ep.enabled && (ep.events.includes(event) || ep.events.includes("*"))
    )

    const results: DeliveryResult[] = []
    for (const endpoint of matching) {
      const result = await deliverWebhook(endpoint, payload)
      results.push(result)
      this.deliveryLog.push({ endpoint: endpoint.id, payload, result })

      if (!result.success) {
        endpoint.failureCount++
        // Auto-disable after 10 consecutive failures
        if (endpoint.failureCount >= 10) {
          endpoint.enabled = false
        }
      } else {
        endpoint.failureCount = 0
        endpoint.lastDelivered = result.timestamp
      }
    }

    return results
  }

  /** Get delivery log */
  getLog(limit = 50) {
    return this.deliveryLog.slice(-limit)
  }

  /** Test a webhook endpoint */
  async test(id: string): Promise<DeliveryResult> {
    const endpoint = this.endpoints.get(id)
    if (!endpoint) throw new Error(`Webhook ${id} not found`)

    return deliverWebhook(endpoint, {
      id: `test_${Date.now()}`,
      event: "lead.created",
      timestamp: new Date().toISOString(),
      data: { test: true, message: "This is a test webhook from KeeLead" },
      source: "keelead",
    })
  }

  /** Get available event types */
  getEventTypes() {
    return Object.entries(WEBHOOK_EVENTS).map(([event, description]) => ({
      event: event as WebhookEvent,
      description,
    }))
  }
}

export const webhookManager = new WebhookManager()
