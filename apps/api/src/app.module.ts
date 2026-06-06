import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { BookingsController } from "./bookings/bookings.controller";
import { BookingsService } from "./bookings/bookings.service";
import { ChatGateway } from "./chat/chat.gateway";
import { ChatSupportService } from "./chat/chat-support.service";
import { CacheService } from "./infrastructure/cache.service";
import { DatabaseService } from "./infrastructure/database.service";
import { QueueService } from "./infrastructure/queue.service";
import { LeadsController } from "./leads/leads.controller";
import { PropertiesController } from "./properties/properties.controller";
import { PropertiesService } from "./properties/properties.service";
import { WebhooksController } from "./webhooks/webhooks.controller";

@Module({
  controllers: [AppController, PropertiesController, BookingsController, LeadsController, WebhooksController],
  providers: [CacheService, QueueService, DatabaseService, PropertiesService, BookingsService, ChatSupportService, ChatGateway]
})
export class AppModule {}
