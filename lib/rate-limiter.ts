// v1.1.7a — P15a: In-memory Rate Limiter
// MP §6.3: In-memory rate limiting iskljucivo za Fazu 1.
// Za 50+ SPV-ova obavezan je Edge mehanizam.

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - windowMs * 2
  const keysToDelete: string[] = []
  store.forEach((entry, key) => {
    if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < cutoff) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach((k) => store.delete(k))
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  cleanup(windowMs)

  const entry = store.get(key) || { timestamps: [] }
  const windowStart = now - windowMs

  // Remove timestamps outside window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0]
    const resetMs = oldestInWindow + windowMs - now
    store.set(key, entry)
    return { allowed: false, remaining: 0, resetMs }
  }

  entry.timestamps.push(now)
  store.set(key, entry)

  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetMs: windowMs,
  }
}

// MP §6.3 — predefined limits
export const RATE_LIMITS = {
  RACUNI_EXPORT: { maxRequests: 10, windowMs: 60 * 1000 },   // 10 req/min
  RACUNI_STORNO: { maxRequests: 5, windowMs: 60 * 1000 },    // 5 req/min
  FINANCIJE: { maxRequests: 60, windowMs: 60 * 1000 },       // 60 req/min
  SPV: { maxRequests: 30, windowMs: 60 * 1000 },             // 30 req/min
} as const
