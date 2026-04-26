import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    providers: [
      { id: "openai", name: "OpenAI", enabled: true, configured: false },
      { id: "anthropic", name: "Anthropic", enabled: false, configured: false },
      { id: "openrouter", name: "OpenRouter", enabled: false, configured: false },
      { id: "nvidia", name: "NVIDIA NIM", enabled: false, configured: false },
      { id: "ollama", name: "Ollama", enabled: false, configured: false },
    ],
    sources: [
      { name: "Web Search", enabled: true },
      { name: "LinkedIn", enabled: true },
      { name: "Crunchbase", enabled: true },
      { name: "GitHub", enabled: true },
      { name: "Google Maps", enabled: true },
    ],
    notifications: { email: true, browser: true, slack: false, discord: false },
    proxy: { enabled: false, url: "", rotation: false },
  })
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()
    // Save settings
    return NextResponse.json({ success: true, message: "Settings saved" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
