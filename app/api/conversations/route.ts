import { NextRequest, NextResponse } from "next/server"

// In-memory conversation store (would use database in production)
const conversations = new Map<string, Array<{ id: string; role: string; content: string; timestamp: string }>>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const messages = conversations.get(id) || []
    return NextResponse.json({ id, messages })
  }

  // List all conversations
  const list = Array.from(conversations.entries()).map(([id, messages]) => ({
    id,
    title: messages[0]?.content?.slice(0, 40) || "New Conversation",
    messageCount: messages.length,
    lastMessage: messages[messages.length - 1]?.timestamp,
  }))
  return NextResponse.json({ conversations: list })
}

export async function POST(request: NextRequest) {
  try {
    const { id, role, content } = await request.json()
    if (!conversations.has(id)) conversations.set(id, [])
    conversations.get(id)!.push({
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (id) conversations.delete(id)
  return NextResponse.json({ success: true })
}
