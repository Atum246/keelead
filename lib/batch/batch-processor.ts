// KeeLead — Batch processor for large operations
import { jobQueue, type Job } from "./queue"
import { sourceManager, type Lead } from "../sources"
import { verifyEmail } from "../email"

export interface BatchOptions {
  concurrency?: number
  onProgress?: (progress: BatchProgress) => void
}

export interface BatchProgress {
  total: number
  completed: number
  failed: number
  percentage: number
  current?: string
}

export class BatchProcessor {
  /** Process a batch of lead searches */
  async searchBatch(
    queries: string[],
    options?: BatchOptions & { count?: number; sources?: string[] }
  ): Promise<Lead[]> {
    const allLeads: Lead[] = []
    const total = queries.length
    let completed = 0
    let failed = 0

    for (const query of queries) {
      try {
        const leads = options?.sources?.length
          ? await sourceManager.searchSources(options.sources, query, { count: options?.count || 10 })
          : await sourceManager.searchAll(query, { count: options?.count || 10 })
        allLeads.push(...leads)
        completed++
      } catch {
        failed++
        completed++
      }

      options?.onProgress?.({
        total,
        completed,
        failed,
        percentage: Math.round((completed / total) * 100),
        current: query,
      })
    }

    return allLeads
  }

  /** Process a batch of email verifications */
  async verifyBatch(
    emails: string[],
    options?: BatchOptions
  ): Promise<Array<{ email: string; score: number; status: string }>> {
    const results: Array<{ email: string; score: number; status: string }> = []
    const total = emails.length
    let completed = 0
    let failed = 0

    for (const email of emails) {
      try {
        const result = await verifyEmail(email)
        results.push({ email: result.email, score: result.score, status: result.status })
        completed++
      } catch {
        failed++
        completed++
        results.push({ email, score: 0, status: "error" })
      }

      options?.onProgress?.({
        total,
        completed,
        failed,
        percentage: Math.round((completed / total) * 100),
        current: email,
      })
    }

    return results
  }

  /** Enqueue a batch job */
  async enqueueBatch(type: string, items: unknown[]): Promise<string> {
    const job = await jobQueue.add(type, { items, total: items.length })
    return job.id
  }

  /** Get batch job status */
  getJobStatus(id: string): Job | undefined {
    return jobQueue.get(id)
  }
}

export const batchProcessor = new BatchProcessor()
