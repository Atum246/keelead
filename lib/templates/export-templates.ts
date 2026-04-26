// KeeLead — Export format templates
export interface ExportTemplate {
  id: string
  name: string
  format: "csv" | "json" | "xlsx" | "vcard" | "pdf"
  description: string
  columns: string[]
  defaultFilename: string
}

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: "leads-csv-basic",
    name: "Basic Lead Export",
    format: "csv",
    description: "Essential lead fields in CSV format",
    columns: ["firstName", "lastName", "email", "phone", "company", "title", "location", "source", "confidence"],
    defaultFilename: "keelead-export-{date}.csv",
  },
  {
    id: "leads-csv-full",
    name: "Full Lead Export",
    format: "csv",
    description: "All available lead fields",
    columns: ["firstName", "lastName", "email", "phone", "company", "title", "website", "linkedin", "twitter", "location", "source", "confidence", "verified", "tags"],
    defaultFilename: "keelead-full-{date}.csv",
  },
  {
    id: "leads-json",
    name: "JSON Export",
    format: "json",
    description: "Full lead data in JSON format",
    columns: ["*"],
    defaultFilename: "keelead-export-{date}.json",
  },
  {
    id: "leads-vcard",
    name: "vCard Export",
    format: "vcard",
    description: "Export as vCard for contact import",
    columns: ["firstName", "lastName", "email", "phone", "company", "title", "website"],
    defaultFilename: "keelead-contacts-{date}.vcf",
  },
  {
    id: "leads-xlsx",
    name: "Excel Export",
    format: "xlsx",
    description: "Formatted Excel spreadsheet",
    columns: ["firstName", "lastName", "email", "phone", "company", "title", "location", "source", "confidence", "verified"],
    defaultFilename: "keelead-export-{date}.xlsx",
  },
  {
    id: "leads-hubspot",
    name: "HubSpot Import Format",
    format: "csv",
    description: "CSV formatted for HubSpot CRM import",
    columns: ["firstName", "lastName", "email", "phone", "company", "title", "website", "linkedin"],
    defaultFilename: "keelead-hubspot-{date}.csv",
  },
  {
    id: "leads-salesforce",
    name: "Salesforce Import Format",
    format: "csv",
    description: "CSV formatted for Salesforce import",
    columns: ["firstName", "lastName", "email", "phone", "company", "title"],
    defaultFilename: "keelead-salesforce-{date}.csv",
  },
]

export function getExportTemplate(id: string): ExportTemplate | undefined {
  return EXPORT_TEMPLATES.find((t) => t.id === id)
}

export function generateVCard(leads: Array<{ firstName: string; lastName: string; email?: string; phone?: string; company?: string; title?: string }>): string {
  return leads
    .map(
      (lead) => [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${lead.firstName} ${lead.lastName}`.trim(),
        `N:${lead.lastName};${lead.firstName};;;`,
        lead.email ? `EMAIL:${lead.email}` : "",
        lead.phone ? `TEL:${lead.phone}` : "",
        lead.company ? `ORG:${lead.company}` : "",
        lead.title ? `TITLE:${lead.title}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n")
}
