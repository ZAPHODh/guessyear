class RateLimiter {
  private timestamps = new Map<string, number[]>();

  canExecute(key: string, maxCalls: number, windowMs: number): boolean {
    const now = Date.now();
    const calls = this.timestamps.get(key) || [];

    // Remove old calls
    const recentCalls = calls.filter(time => now - time < windowMs);

    if (recentCalls.length >= maxCalls) {
      return false;
    }

    recentCalls.push(now);
    this.timestamps.set(key, recentCalls);
    return true;
  }

  reset(key: string) {
    this.timestamps.delete(key);
  }

  clear() {
    this.timestamps.clear();
  }

  getRemainingCalls(key: string, maxCalls: number, windowMs: number): number {
    const now = Date.now();
    const calls = this.timestamps.get(key) || [];
    const recentCalls = calls.filter(time => now - time < windowMs);

    return Math.max(0, maxCalls - recentCalls.length);
  }
}

export const rateLimiter = new RateLimiter();
