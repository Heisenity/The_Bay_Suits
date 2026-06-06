import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto, QuoteDto } from "./bookings.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post("quote")
  quote(@Body() input: QuoteDto) {
    return this.bookings.quote(input);
  }

  @Post()
  create(@Body() input: CreateBookingDto) {
    return this.bookings.create(input);
  }

  @Get("availability/:propertyId")
  availability(
    @Param("propertyId") propertyId: string,
    @Query("checkIn") checkIn: string,
    @Query("checkOut") checkOut: string
  ) {
    return this.bookings.availability(propertyId, checkIn, checkOut);
  }
}
