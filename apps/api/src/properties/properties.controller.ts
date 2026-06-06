import { Controller, Get, Param } from "@nestjs/common";
import { PropertiesService } from "./properties.service";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @Get()
  list() {
    return this.properties.list();
  }

  @Get(":slug")
  get(@Param("slug") slug: string) {
    return this.properties.findBySlug(slug);
  }
}
