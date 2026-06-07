import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto, CreateCalendarBlockDto, ExtendStayDto, QuoteDto } from "./bookings.dto";

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

  @Get("admin/blocks")
  listCalendarBlocks(@Query("propertyId") propertyId?: string) {
    return this.bookings.listCalendarBlocks(propertyId);
  }

  @Post("admin/blocks")
  createCalendarBlock(@Body() input: CreateCalendarBlockDto) {
    return this.bookings.createCalendarBlock(input);
  }

  @Post("admin/blocks/:blockId/remove")
  removeCalendarBlock(@Param("blockId") blockId: string) {
    return this.bookings.removeCalendarBlock(blockId);
  }

  @Get("calendar/:propertyId")
  monthAvailability(@Param("propertyId") propertyId: string, @Query("month") month: string) {
    return this.bookings.monthAvailability(propertyId, month);
  }

  @Get("availability/:propertyId")
  availability(
    @Param("propertyId") propertyId: string,
    @Query("checkIn") checkIn: string,
    @Query("checkOut") checkOut: string
  ) {
    return this.bookings.availability(propertyId, checkIn, checkOut);
  }

  @Get(":confirmation/messages")
  messages(@Param("confirmation") confirmation: string) {
    return this.bookings.conversation(confirmation);
  }

  @Post(":confirmation/invoice")
  invoice(@Param("confirmation") confirmation: string) {
    return this.bookings.sendInvoice(confirmation);
  }

  @Post(":confirmation/extend")
  extend(@Param("confirmation") confirmation: string, @Body() input: ExtendStayDto) {
    return this.bookings.extendStay(confirmation, input.checkOut);
  }

  @Get(":confirmation")
  reservation(@Param("confirmation") confirmation: string) {
    return this.bookings.reservation(confirmation);
  }
}
