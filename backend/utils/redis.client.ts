import Redis, { Redis as RedisInstance } from 'ioredis';

type JsonValue = Record<string, unknown> | Array<unknown>;

const DEFAULT_REDIS_URL =
  process.env.REDIS_URL;
const DEFAULT_REDIS_PASSWORD = process.env.REDIS_PASSWORD;

class RedisClient {
  private client: RedisInstance;

  constructor(url: string) {
    this.client = new (Redis as any)(url, {
      lazyConnect: false,
      maxRetriesPerRequest: 3,
      reconnectOnError: () => true,
      password: DEFAULT_REDIS_PASSWORD || undefined,
    });

    this.client.on('error', (error) => {
      console.error('Radis Connection error:', error);
    });

    this.client.on('connect', () => {
      console.log('Redis Connected');
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    await this.client.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setJson(key: string, payload: JsonValue, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(payload), ttlSeconds);
  }

  async getJson<T = JsonValue>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Redis Failed to parse JSON payload', { key, error });
      return null;
    }
  }

  async setSession(sessionId: string, data: JsonValue, ttlSeconds = 1800) {
    await this.setJson(`session:${sessionId}`, data, ttlSeconds);
  }

  async getSession<T = JsonValue>(sessionId: string): Promise<T | null> {
    return this.getJson<T>(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string) {
    await this.delete(`session:${sessionId}`);
  }

  async setGridState(roomId: string, gridState: JsonValue) {
    await this.setJson(`grid:${roomId}:state`, gridState);
  }

  async getGridState<T = JsonValue>(roomId: string): Promise<T | null> {
    return this.getJson<T>(`grid:${roomId}:state`);
  }
}

export const redisClient = new RedisClient(DEFAULT_REDIS_URL);