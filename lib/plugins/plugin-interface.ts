// KeeLead — Plugin interface
export interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  category: "integration" | "source" | "enrichment" | "notification" | "export" | "custom"
  enabled: boolean
  config: Record<string, unknown>
  hooks: PluginHooks
}

export interface PluginHooks {
  onLeadCreated?: (lead: unknown) => Promise<void>
  onLeadUpdated?: (lead: unknown) => Promise<void>
  onEmailVerified?: (result: unknown) => Promise<void>
  onCampaignCompleted?: (campaign: unknown) => Promise<void>
  onSearchComplete?: (results: unknown) => Promise<void>
  onExportComplete?: (exportData: unknown) => Promise<void>
}

export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  category: Plugin["category"]
  main: string
  config: Array<{
    key: string
    label: string
    type: "string" | "number" | "boolean" | "select"
    required: boolean
    default?: unknown
    options?: string[]
  }>
}
