// KeeLead — Webhook delivery with retries
import type { WebhookPayload } from "./event-types"

export interface DeliveryResult {
  success: boolean
  statusCode?: number
  attempts: number
  error?: string
  timestamp: string
}

export interface WebhookEndpoint {
  id: string
  url: string
  secret?: string
  events: string[]
  enabled: boolean
  createdAt: string
  lastDelivered?: string
  failureCount: number
}

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 5000, 30000] // 1s, 5s, 30s

export async function deliverWebhook(
  endpoint: WebhookEndpoint,
  payload: WebhookPayload
): Promise<DeliveryResult> {
  let lastError: string | undefined

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "KeeLead-Webhook/1.0",
        "X-Webhook-Event": payload.event,
        "X-Webhook-ID": payload.id,
        "X-Webhook-Timestamp": payload.timestamp,
      }

      if (endpoint.secret) {
        const signature = await signPayload(JSON.stringify(payload), endpoint.secret)
        headers["X-Webhook-Signature"] = signature
      }

      const response = await fetch(endpoint.url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      })

      if (response.ok) {
        return {
          success: true,
          statusCode: response.status,
          attempts: attempt + 1,
          timestamp: new Date().toISOString(),
        }
      }

      lastError = `HTTP ${response.status}: ${response.statusText}`
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
    }

    // Wait before retry (except on last attempt)
    if (attempt < MAX_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]))
    }
  }

  return {
    success: false,
    attempts: MAX_RETRIES,
    error: lastError,
    timestamp: new Date().toISOString(),
  }
}

async function signPayload(payload: string, secret: string): Promise<string> {
  // Simple HMAC-like signature (in production, use crypto.subtle)
  const encoder = new TextEncoder()
  const data = encoder.encode(payload + secret)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expected = await signPayload(payload, secret)
  return expected === signature
}
