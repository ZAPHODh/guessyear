interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class LobbyCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 60000; // 1 minute

  set<T>(key: string, data: T, ttl = this.defaultTTL) {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: RegExp) {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const lobbyCache = new LobbyCache();
