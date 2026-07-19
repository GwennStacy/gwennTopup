export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000): RateLimitResult {
  const now = Date.now();
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  const record = rateLimitStore.get(ip)!;

  // If the time window has passed, reset the count
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { success: true, limit, remaining: limit - 1, reset: record.resetTime };
  }

  // Increment the count
  record.count += 1;

  if (record.count > limit) {
    return { success: false, limit, remaining: 0, reset: record.resetTime };
  }

  return { success: true, limit, remaining: limit - record.count, reset: record.resetTime };
}
