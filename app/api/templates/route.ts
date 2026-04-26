import { NextResponse } from "next/server"
import { EMAIL_TEMPLATES } from "@/lib/templates/email-templates"
import { SEARCH_TEMPLATES } from "@/lib/templates/search-templates"
import { EXPORT_TEMPLATES } from "@/lib/templates/export-templates"

export async function GET() {
  return NextResponse.json({
    email: EMAIL_TEMPLATES,
    search: SEARCH_TEMPLATES,
    export: EXPORT_TEMPLATES,
    totals: {
      email: EMAIL_TEMPLATES.length,
      search: SEARCH_TEMPLATES.length,
      export: EXPORT_TEMPLATES.length,
    },
  })
}
