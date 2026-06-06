import { Injectable } from "@nestjs/common";

type Entry<T> = { value: T; expiresAt: number };

@Injectable()
export class CacheService {
  private readonly entries = new Map<string, Entry<unknown>>();
  private readonly inflight = new Map<string, Promise<unknown>>();

  async getOrSet<T>(key: string, ttlMs: number, factory: () => Promise<T> | T): Promise<T> {
    const cached = this.entries.get(key) as Entry<T> | undefined;
    if (cached && cached.expiresAt > Date.now()) return cached.value;

    const pending = this.inflight.get(key) as Promise<T> | undefined;
    if (pending) return pending;

    const task = Promise.resolve(factory()).then((value) => {
      this.entries.set(key, { value, expiresAt: Date.now() + ttlMs });
      this.inflight.delete(key);
      return value;
    }).catch((error) => {
      this.inflight.delete(key);
      throw error;
    });

    this.inflight.set(key, task);
    return task;
  }

  invalidate(prefix: string) {
    for (const key of this.entries.keys()) {
      if (key.startsWith(prefix)) this.entries.delete(key);
    }
  }
}
