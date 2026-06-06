import { Injectable } from "@nestjs/common";

@Injectable()
export class QueueService {
  private readonly tails = new Map<string, Promise<unknown>>();

  async serial<T>(key: string, work: () => Promise<T>): Promise<T> {
    const previous = this.tails.get(key) || Promise.resolve();
    const current = previous.catch(() => undefined).then(work);
    this.tails.set(key, current);
    try {
      return await current;
    } finally {
      if (this.tails.get(key) === current) this.tails.delete(key);
    }
  }
}
