import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Mock Redis for local dev (khi chưa có Upstash credentials)
const mockRedis = {
  sadd: async () => 1,
  eval: async () => [0, 1],
  pipeline: () => ({
    exec: async () => [],
    eval: () => ({ exec: async () => [] }),
    sadd: () => ({ exec: async () => [] }),
  }),
} as unknown as Redis;

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : mockRedis;

/**
 * Rate limiting strategy cho /api/chat:
 * - 10 requests / 1 phút mỗi IP (burst protection)
 * - 30 requests / 1 giờ mỗi IP (daily usage limit)
 *
 * Dùng thuật toán Sliding Window để phân phối đều, tránh request storm.
 */
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'bravee-blog:chat',
});

// Stricter limit theo giờ (ngăn abuse dài hạn)
export const ratelimitHourly = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 h'),
  analytics: true,
  prefix: 'bravee-blog:chat:hourly',
});
