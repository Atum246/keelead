// KeeLead — Plugin Manager
import type { Plugin, PluginManifest, PluginHooks } from "./plugin-interface"

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map()

  /** Register a plugin */
  register(manifest: PluginManifest, hooks: PluginHooks = {}): Plugin {
    const plugin: Plugin = {
      ...manifest,
      enabled: true,
      config: {},
      hooks,
    }
    this.plugins.set(plugin.id, plugin)
    return plugin
  }

  /** Enable/disable a plugin */
  setEnabled(id: string, enabled: boolean): void {
    const plugin = this.plugins.get(id)
    if (plugin) plugin.enabled = enabled
  }

  /** Update plugin config */
  updateConfig(id: string, config: Record<string, unknown>): void {
    const plugin = this.plugins.get(id)
    if (plugin) plugin.config = { ...plugin.config, ...config }
  }

  /** Get all plugins */
  list(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  /** Get enabled plugins */
  getEnabled(): Plugin[] {
    return this.list().filter((p) => p.enabled)
  }

  /** Get a specific plugin */
  get(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  /** Fire a hook across all enabled plugins */
  async fireHook(hookName: keyof PluginHooks, data: unknown): Promise<void> {
    const enabled = this.getEnabled()
    for (const plugin of enabled) {
      const hook = plugin.hooks[hookName]
      if (hook) {
        try {
          await hook(data)
        } catch (err) {
          console.error(`Plugin ${plugin.name} hook ${hookName} failed:`, err)
        }
      }
    }
  }

  /** Remove a plugin */
  unregister(id: string): boolean {
    return this.plugins.delete(id)
  }
}

export const pluginManager = new PluginManager()

// Built-in plugins
export const BUILTIN_PLUGINS: PluginManifest[] = [
  {
    id: "slack-notifications",
    name: "Slack Notifications",
    version: "1.0.0",
    description: "Send lead alerts to Slack channels",
    author: "KeeLead",
    category: "notification",
    main: "slack.ts",
    config: [
      { key: "webhookUrl", label: "Webhook URL", type: "string", required: true },
      { key: "channel", label: "Channel", type: "string", required: false },
    ],
  },
  {
    id: "discord-notifications",
    name: "Discord Notifications",
    version: "1.0.0",
    description: "Send lead alerts to Discord channels",
    author: "KeeLead",
    category: "notification",
    main: "discord.ts",
    config: [
      { key: "webhookUrl", label: "Webhook URL", type: "string", required: true },
    ],
  },
  {
    id: "google-sheets-export",
    name: "Google Sheets Export",
    version: "1.0.0",
    description: "Export leads directly to Google Sheets",
    author: "KeeLead",
    category: "export",
    main: "sheets.ts",
    config: [
      { key: "spreadsheetId", label: "Spreadsheet ID", type: "string", required: true },
    ],
  },
  {
    id: "hubspot-crm",
    name: "HubSpot CRM",
    version: "1.0.0",
    description: "Sync leads with HubSpot CRM",
    author: "KeeLead",
    category: "integration",
    main: "hubspot.ts",
    config: [
      { key: "apiKey", label: "API Key", type: "string", required: true },
      { key: "portalId", label: "Portal ID", type: "string", required: true },
    ],
  },
  {
    id: "salesforce-crm",
    name: "Salesforce CRM",
    version: "1.0.0",
    description: "Sync leads with Salesforce",
    author: "KeeLead",
    category: "integration",
    main: "salesforce.ts",
    config: [
      { key: "instanceUrl", label: "Instance URL", type: "string", required: true },
      { key: "accessToken", label: "Access Token", type: "string", required: true },
    ],
  },
  {
    id: "zapier-integration",
    name: "Zapier",
    version: "1.0.0",
    description: "Connect KeeLead with 5000+ apps via Zapier",
    author: "KeeLead",
    category: "integration",
    main: "zapier.ts",
    config: [
      { key: "webhookUrl", label: "Zapier Webhook URL", type: "string", required: true },
    ],
  },
]
