// KeeLead — In-memory cache manager (Redis-like interface)
export interface CacheEntry<T = unknown> {
  value: T
  createdAt: number
  expiresAt?: number
  accessCount: number
  lastAccessed: number
}

export interface CacheOptions {
  ttl?: number // time to live in milliseconds
  maxEntries?: number
}

export class CacheManager {
  private store: Map<string, CacheEntry> = new Map()
  private defaultTTL: number
  private maxEntries: number

  constructor(options?: CacheOptions) {
    this.defaultTTL = options?.ttl || 300_000 // 5 minutes default
    this.maxEntries = options?.maxEntries || 10_000
  }

  /** Get a value from cache */
  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    entry.accessCount++
    entry.lastAccessed = Date.now()
    return entry.value as T
  }

  /** Set a value in cache */
  set<T>(key: string, value: T, ttl?: number): void {
    // Evict if at capacity
    if (this.store.size >= this.maxEntries) {
      this.evictLRU()
    }

    const now = Date.now()
    this.store.set(key, {
      value,
      createdAt: now,
      expiresAt: ttl ? now + ttl : now + this.defaultTTL,
      accessCount: 0,
      lastAccessed: now,
    })
  }

  /** Delete a key */
  delete(key: string): boolean {
    return this.store.delete(key)
  }

  /** Check if key exists */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /** Get or set (cache-aside pattern) */
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) return cached

    const value = await factory()
    this.set(key, value, ttl)
    return value
  }

  /** Clear all entries */
  clear(): void {
    this.store.clear()
  }

  /** Get cache stats */
  getStats() {
    const entries = Array.from(this.store.values())
    const now = Date.now()
    const active = entries.filter((e) => !e.expiresAt || now < e.expiresAt)
    return {
      totalEntries: this.store.size,
      activeEntries: active.length,
      expiredEntries: entries.length - active.length,
      maxSize: this.maxEntries,
      defaultTTL: this.defaultTTL,
    }
  }

  /** Evict least recently used entries */
  private evictLRU(): void {
    const entries = Array.from(this.store.entries())
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
    // Remove oldest 10%
    const toRemove = Math.max(1, Math.floor(entries.length * 0.1))
    for (let i = 0; i < toRemove; i++) {
      this.store.delete(entries[i][0])
    }
  }
}

// Singleton caches for different purposes
export const leadCache = new CacheManager({ ttl: 600_000, maxEntries: 5000 }) // 10 min
export const companyCache = new CacheManager({ ttl: 1_800_000, maxEntries: 2000 }) // 30 min
export const emailCache = new CacheManager({ ttl: 3_600_000, maxEntries: 10000 }) // 1 hour
export const searchCache = new CacheManager({ ttl: 300_000, maxEntries: 1000 }) // 5 min
