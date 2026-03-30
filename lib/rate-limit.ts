type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

function nowMs(): number {
  return Date.now();
}

function cleanupExpiredEntries(currentTime: number): void {
  store.forEach((entry, key) => {
    if (entry.resetAt <= currentTime) {
      store.delete(key);
    }
  });
}

export function checkRateLimit(key: string, limit: number, windowMs: number): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const currentTime = nowMs();

  if (store.size > 2000) {
    cleanupExpiredEntries(currentTime);
  }

  const existing = store.get(key);

  if (!existing || existing.resetAt <= currentTime) {
    store.set(key, {
      count: 1,
      resetAt: currentTime + windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - currentTime) / 1000)),
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}
