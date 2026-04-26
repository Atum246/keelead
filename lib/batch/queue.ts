// KeeLead — Job queue (Bull/BullMQ-style interface)
export interface Job<T = unknown> {
  id: string
  type: string
  data: T
  status: "waiting" | "active" | "completed" | "failed" | "delayed"
  priority: number
  attempts: number
  maxAttempts: number
  createdAt: string
  startedAt?: string
  completedAt?: string
  failedAt?: string
  error?: string
  result?: unknown
}

export type JobProcessor<T = unknown> = (data: T) => Promise<unknown>

export class JobQueue {
  private jobs: Map<string, Job> = new Map()
  private processors: Map<string, JobProcessor> = new Map()
  private processing = false
  private concurrency: number

  constructor(concurrency = 5) {
    this.concurrency = concurrency
  }

  /** Register a processor for a job type */
  process<T>(type: string, processor: JobProcessor<T>): void {
    this.processors.set(type, processor as JobProcessor)
  }

  /** Add a job to the queue */
  async add<T>(type: string, data: T, options?: { priority?: number; maxAttempts?: number; delay?: number }): Promise<Job<T>> {
    const job: Job<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      data,
      status: options?.delay ? "delayed" : "waiting",
      priority: options?.priority || 0,
      attempts: 0,
      maxAttempts: options?.maxAttempts || 3,
      createdAt: new Date().toISOString(),
    }
    this.jobs.set(job.id, job)
    this.processNext()
    return job
  }

  /** Get a job by ID */
  get(id: string): Job | undefined {
    return this.jobs.get(id)
  }

  /** Get all jobs */
  list(filter?: { type?: string; status?: Job["status"] }): Job[] {
    let jobs = Array.from(this.jobs.values())
    if (filter?.type) jobs = jobs.filter((j) => j.type === filter.type)
    if (filter?.status) jobs = jobs.filter((j) => j.status === filter.status)
    return jobs.sort((a, b) => b.priority - a.priority)
  }

  /** Remove a job */
  remove(id: string): boolean {
    return this.jobs.delete(id)
  }

  /** Get queue stats */
  getStats() {
    const jobs = this.list()
    return {
      total: jobs.length,
      waiting: jobs.filter((j) => j.status === "waiting").length,
      active: jobs.filter((j) => j.status === "active").length,
      completed: jobs.filter((j) => j.status === "completed").length,
      failed: jobs.filter((j) => j.status === "failed").length,
      delayed: jobs.filter((j) => j.status === "delayed").length,
    }
  }

  private async processNext(): Promise<void> {
    if (this.processing) return
    this.processing = true

    const waiting = this.list({ status: "waiting" }).slice(0, this.concurrency)
    await Promise.all(waiting.map((job) => this.execute(job)))

    this.processing = false
  }

  private async execute(job: Job): Promise<void> {
    const processor = this.processors.get(job.type)
    if (!processor) {
      job.status = "failed"
      job.error = `No processor for job type: ${job.type}`
      return
    }

    job.status = "active"
    job.startedAt = new Date().toISOString()
    job.attempts++

    try {
      job.result = await processor(job.data)
      job.status = "completed"
      job.completedAt = new Date().toISOString()
    } catch (err) {
      if (job.attempts < job.maxAttempts) {
        job.status = "waiting" // retry
      } else {
        job.status = "failed"
        job.failedAt = new Date().toISOString()
        job.error = err instanceof Error ? err.message : String(err)
      }
    }
  }
}

export const jobQueue = new JobQueue()
