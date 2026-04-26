import { NextRequest, NextResponse } from "next/server"
import { verifyEmail, verifyEmails } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { emails, email } = await request.json()

    if (email) {
      const result = await verifyEmail(email)
      return NextResponse.json({ results: [result] })
    }

    if (emails && Array.isArray(emails)) {
      const results = await verifyEmails(emails)
      return NextResponse.json({ results })
    }

    return NextResponse.json({ error: "Email or emails array required" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
