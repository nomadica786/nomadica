export interface TokenBucket {
  tokens: number;
  lastRefilled: number;
}

export class TokenBucketLimiter {
  private capacity: number;
  private refillRatePerMs: number;
  private buckets: Map<string, TokenBucket>;

  constructor(capacity: number, refillRatePerSecond: number) {
    this.capacity = capacity;
    this.refillRatePerMs = refillRatePerSecond / 1000;
    this.buckets = new Map();
  }

  public limit(key: string): { allowed: boolean; limit: number; remaining: number } {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefilled: now,
      };
      this.buckets.set(key, bucket);
    } else {
      const elapsedMs = now - bucket.lastRefilled;
      const tokensToAdd = elapsedMs * this.refillRatePerMs;
      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefilled = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      this.buckets.set(key, bucket);
      return {
        allowed: true,
        limit: this.capacity,
        remaining: Math.floor(bucket.tokens),
      };
    }

    return {
      allowed: false,
      limit: this.capacity,
      remaining: Math.floor(bucket.tokens),
    };
  }

  public cleanup(maxAgeMs: number = 3600000): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastRefilled > maxAgeMs) {
        this.buckets.delete(key);
      }
    }
  }
}

// Preserve state across dev reload using globalThis
const globalForLimiter = globalThis as unknown as {
  limiter?: TokenBucketLimiter;
};

// Capacity: 100 tokens, Refill rate: 20 tokens/second (adds 1 token every 50ms)
export const limiter = globalForLimiter.limiter ?? new TokenBucketLimiter(100, 20);

if (process.env.NODE_ENV !== "production") {
  globalForLimiter.limiter = limiter;
}
