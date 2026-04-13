import { Redis } from '@upstash/redis'

let redisInstance: Redis | null = null

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  if (!redisInstance) {
    redisInstance = new Redis({
      url,
      token,
    })
  }

  return redisInstance
}