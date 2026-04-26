#!/usr/bin/env tsx
/**
 * KeeLead WebSocket Server — Real-time Events
 * 
 * Provides real-time event streaming for:
 * - New lead notifications
 * - Verification results
 * - Campaign updates
 * - Signal alerts
 * - Analytics updates
 * 
 * Usage:
 *   npx tsx websocket/server.ts
 */

import { WebSocketServer, WebSocket } from "ws"
import http from "http"

const PORT = parseInt(process.env.WS_PORT || "3002")

interface WsClient {
  ws: WebSocket
  subscriptions: Set<string>
}

const clients: Set<WsClient> = new Set()

// Event types
export type KeeLeadEvent =
  | { type: "lead.created"; data: Record<string, unknown> }
  | { type: "lead.updated"; data: Record<string, unknown> }
  | { type: "lead.deleted"; data: { id: string } }
  | { type: "verification.completed"; data: Record<string, unknown> }
  | { type: "campaign.sent"; data: Record<string, unknown> }
  | { type: "campaign.opened"; data: Record<string, unknown> }
  | { type: "campaign.replied"; data: Record<string, unknown> }
  | { type: "signal.detected"; data: Record<string, unknown> }
  | { type: "enrichment.completed"; data: Record<string, unknown> }
  | { type: "export.ready"; data: Record<string, unknown> }
  | { type: "analytics.updated"; data: Record<string, unknown> }

// Broadcast to all subscribed clients
export function broadcast(event: KeeLeadEvent) {
  const message = JSON.stringify(event)
  for (const client of clients) {
    if (client.subscriptions.has(event.type) || client.subscriptions.has("*")) {
      client.ws.send(message)
    }
  }
}

// HTTP + WebSocket server
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ status: "ok", clients: clients.size }))
    return
  }
  res.writeHead(404)
  res.end()
})

const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
  const client: WsClient = { ws, subscriptions: new Set(["*"]) }
  clients.add(client)

  ws.send(JSON.stringify({
    type: "connected",
    message: "KeeLead WebSocket connected",
    events: [
      "lead.created", "lead.updated", "lead.deleted",
      "verification.completed", "campaign.sent", "campaign.opened",
      "campaign.replied", "signal.detected", "enrichment.completed",
      "export.ready", "analytics.updated",
    ],
  }))

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString())
      if (msg.type === "subscribe") {
        client.subscriptions = new Set(msg.events || ["*"])
        ws.send(JSON.stringify({ type: "subscribed", events: Array.from(client.subscriptions) }))
      }
      if (msg.type === "unsubscribe") {
        for (const event of msg.events || []) {
          client.subscriptions.delete(event)
        }
      }
      if (msg.type === "ping") {
        ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }))
      }
    } catch {}
  })

  ws.on("close", () => {
    clients.delete(client)
  })
})

server.listen(PORT, () => {
  console.log(`KeeLead WebSocket server running on ws://localhost:${PORT}`)
})

// Example usage from client:
// const ws = new WebSocket("ws://localhost:3002")
// ws.onmessage = (e) => console.log(JSON.parse(e.data))
// ws.send(JSON.stringify({ type: "subscribe", events: ["lead.created", "signal.detected"] }))
