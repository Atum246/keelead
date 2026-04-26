// KeeLead — Task scheduler for recurring operations
export interface ScheduledTask {
  id: string
  name: string
  type: string
  data: Record<string, unknown>
  cron: string // simplified: "every 5m", "every 1h", "every day", etc.
  enabled: boolean
  lastRun?: string
  nextRun: string
  createdAt: string
}

const CRON_INTERVALS: Record<string, number> = {
  "every 1m": 60_000,
  "every 5m": 300_000,
  "every 15m": 900_000,
  "every 30m": 1_800_000,
  "every 1h": 3_600_000,
  "every 6h": 21_600_000,
  "every 12h": 43_200_000,
  "every day": 86_400_000,
  "every week": 604_800_000,
}

export class Scheduler {
  private tasks: Map<string, ScheduledTask> = new Map()
  private timers: Map<string, ReturnType<typeof setInterval>> = new Map()
  private handlers: Map<string, (data: Record<string, unknown>) => Promise<void>> = new Map()

  /** Register a handler for a task type */
  on(type: string, handler: (data: Record<string, unknown>) => Promise<void>): void {
    this.handlers.set(type, handler)
  }

  /** Create a scheduled task */
  create(name: string, type: string, data: Record<string, unknown>, cron: string): ScheduledTask {
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const interval = CRON_INTERVALS[cron] || 3_600_000
    const task: ScheduledTask = {
      id,
      name,
      type,
      data,
      cron,
      enabled: true,
      nextRun: new Date(Date.now() + interval).toISOString(),
      createdAt: new Date().toISOString(),
    }
    this.tasks.set(id, task)
    this.startTask(task)
    return task
  }

  /** Enable/disable a task */
  setEnabled(id: string, enabled: boolean): void {
    const task = this.tasks.get(id)
    if (!task) return
    task.enabled = enabled
    if (enabled) this.startTask(task)
    else this.stopTask(id)
  }

  /** Delete a task */
  delete(id: string): boolean {
    this.stopTask(id)
    return this.tasks.delete(id)
  }

  /** List all tasks */
  list(): ScheduledTask[] {
    return Array.from(this.tasks.values())
  }

  /** Run a task immediately */
  async runNow(id: string): Promise<void> {
    const task = this.tasks.get(id)
    if (!task) throw new Error(`Task ${id} not found`)
    await this.execute(task)
  }

  private startTask(task: ScheduledTask): void {
    this.stopTask(task.id)
    const interval = CRON_INTERVALS[task.cron] || 3_600_000
    const timer = setInterval(() => this.execute(task), interval)
    this.timers.set(task.id, timer)
  }

  private stopTask(id: string): void {
    const timer = this.timers.get(id)
    if (timer) {
      clearInterval(timer)
      this.timers.delete(id)
    }
  }

  private async execute(task: ScheduledTask): Promise<void> {
    const handler = this.handlers.get(task.type)
    if (!handler) return
    try {
      await handler(task.data)
      task.lastRun = new Date().toISOString()
    } catch (err) {
      console.error(`Scheduled task ${task.name} failed:`, err)
    }
  }
}

export const scheduler = new Scheduler()
