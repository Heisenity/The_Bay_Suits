import { Controller, Get } from "@nestjs/common";
import { DatabaseService } from "./infrastructure/database.service";
import { properties } from "./data";

@Controller()
export class AppController {
  constructor(private readonly database: DatabaseService) {}

  @Get("health")
  health() {
    return { status: "ok", service: "the-bay-suites-api", timestamp: new Date().toISOString() };
  }

  @Get("dashboard")
  dashboard() {
    const bookings = this.database.listBookings();
    return {
      properties: properties.length,
      bookings: bookings.length,
      confirmedRevenue: bookings.reduce((sum, booking) => sum + booking.total, 0),
      occupancy: bookings.length ? 74 : 0,
      recentBookings: bookings.slice(-8).reverse()
    };
  }
}
