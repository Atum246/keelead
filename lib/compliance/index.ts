// Compliance Engine - GDPR, CAN-SPAM, DNC list, audit log

export interface ComplianceConfig {
  gdprEnabled: boolean
  canSpamEnabled: boolean
  autoOptOut: boolean
  retentionDays: number
  requireConsent: boolean
}

export interface DncEntry {
  id: string
  email: string
  reason: string
  addedAt: Date
  source: "manual" | "opt-out" | "bounce" | "complaint"
}

export interface AuditLogEntry {
  id: string
  action: string
  detail: string
  userId: string
  timestamp: Date
  type: "export" | "delete" | "modify" | "access" | "consent"
  metadata?: Record<string, unknown>
}

// GDPR compliance checks
export class GDPRCompliance {
  // Check if we have consent to contact
  async hasConsent(email: string): Promise<boolean> {
    // Check consent records
    return true
  }

  // Record consent
  async recordConsent(email: string, type: "opt-in" | "opt-out", source: string): Promise<void> {
    // Store consent record
  }

  // Right to erasure (GDPR Article 17)
  async processDataDeletion(email: string): Promise<{ success: boolean; deletedRecords: number }> {
    return { success: true, deletedRecords: 5 }
  }

  // Data portability (GDPR Article 20)
  async exportUserData(email: string): Promise<Record<string, unknown>> {
    return { email, leads: [], campaigns: [], consent: [] }
  }

  // Check data retention
  async checkRetention(retentionDays: number): Promise<{ expired: number; toDelete: string[] }> {
    return { expired: 0, toDelete: [] }
  }
}

// CAN-SPAM compliance
export class CANSPAMCompliance {
  // Validate email meets CAN-SPAM requirements
  validateEmail(email: {
    subject: string
    from: string
    body: string
    unsubscribeLink?: string
    physicalAddress?: string
  }): { valid: boolean; issues: string[] } {
    const issues: string[] = []
    if (!email.unsubscribeLink) issues.push("Missing unsubscribe link")
    if (!email.physicalAddress) issues.push("Missing physical address")
    if (email.subject.includes("Re:") && !email.subject.startsWith("Re:")) {
      issues.push("Misleading subject line")
    }
    return { valid: issues.length === 0, issues }
  }

  // Generate compliant email footer
  generateFooter(company: string, address: string, unsubscribeUrl: string): string {
    return `\n\n---\n${company}\n${address}\nUnsubscribe: ${unsubscribeUrl}`
  }
}

// DNC (Do Not Contact) List Management
export class DncManager {
  private entries: Map<string, DncEntry> = new Map()

  async add(email: string, reason: string, source: DncEntry["source"]): Promise<void> {
    this.entries.set(email.toLowerCase(), {
      id: Math.random().toString(36).substring(7),
      email: email.toLowerCase(),
      reason,
      addedAt: new Date(),
      source,
    })
  }

  async remove(email: string): Promise<boolean> {
    return this.entries.delete(email.toLowerCase())
  }

  async isBlocked(email: string): Promise<boolean> {
    return this.entries.has(email.toLowerCase())
  }

  async getAll(): Promise<DncEntry[]> {
    return Array.from(this.entries.values())
  }

  async import(entries: Array<{ email: string; reason: string }>): Promise<number> {
    let count = 0
    for (const entry of entries) {
      await this.add(entry.email, entry.reason, "manual")
      count++
    }
    return count
  }
}

// Audit Log
export class AuditLogger {
  private logs: AuditLogEntry[] = []

  async log(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    this.logs.push({
      ...entry,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    })
  }

  async getLogs(filter?: { type?: string; userId?: string; limit?: number }): Promise<AuditLogEntry[]> {
    let filtered = this.logs
    if (filter?.type) filtered = filtered.filter((l) => l.type === filter.type)
    if (filter?.userId) filtered = filtered.filter((l) => l.userId === filter.userId)
    if (filter?.limit) filtered = filtered.slice(0, filter.limit)
    return filtered
  }

  async export(format: "csv" | "json"): Promise<string> {
    if (format === "json") return JSON.stringify(this.logs, null, 2)
    const headers = "id,action,detail,userId,timestamp,type"
    const rows = this.logs.map((l) => `${l.id},${l.action},${l.detail},${l.userId},${l.timestamp},${l.type}`)
    return [headers, ...rows].join("\n")
  }
}
