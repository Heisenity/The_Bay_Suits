import { Injectable, NotFoundException } from "@nestjs/common";
import { properties } from "../data";
import { CacheService } from "../infrastructure/cache.service";

@Injectable()
export class PropertiesService {
  constructor(private readonly cache: CacheService) {}

  list() {
    return this.cache.getOrSet("properties:list", 60_000, () => properties);
  }

  async findBySlug(slug: string) {
    const property = await this.cache.getOrSet(`properties:${slug}`, 60_000, () =>
      properties.find((item) => item.slug === slug)
    );
    if (!property) throw new NotFoundException("Property not found");
    return property;
  }
}
