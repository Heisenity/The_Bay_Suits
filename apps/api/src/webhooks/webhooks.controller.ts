import { Body, Controller, Headers, Param, Post } from "@nestjs/common";
import { DatabaseService } from "../infrastructure/database.service";

@Controller("webhooks")
export class WebhooksController {
  constructor(private readonly database: DatabaseService) {}

  @Post(":provider")
  receive(
    @Param("provider") provider: string,
    @Headers("x-event-id") externalId: string | undefined,
    @Body() payload: Record<string, unknown>
  ) {
    return this.database.createWebhook(provider, externalId, payload);
  }
}
