import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "node:crypto";
import { properties } from "../data";
import { CacheService } from "../infrastructure/cache.service";
import { DatabaseService } from "../infrastructure/database.service";
import { QueueService } from "../infrastructure/queue.service";
import { CreateBookingDto, QuoteDto } from "./bookings.dto";

@Injectable()
export class BookingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly queue: QueueService,
    private readonly cache: CacheService
  ) {}

  quote(input: QuoteDto) {
    const property = properties.find((item) => item.id === input.propertyId);
    if (!property) throw new NotFoundException("Property not found");
    const start = new Date(`${input.checkIn}T12:00:00Z`);
    const end = new Date(`${input.checkOut}T12:00:00Z`);
    const nights = Math.round((end.getTime() - start.getTime()) / 86400000);
    if (!Number.isFinite(nights) || nights < 1) throw new BadRequestException("Check-out must be after check-in");
    if (input.guests > property.guests) throw new BadRequestException("Guest count exceeds property capacity");
    const accommodation = nights * property.price;
    const cleaningFee = property.bedrooms > 2 ? 135 : 95;
    const serviceFee = Math.round(accommodation * 0.08);
    const tax = Math.round((accommodation + cleaningFee + serviceFee) * 0.13);
    return {
      propertyId: input.propertyId,
      nights,
      nightlyRate: property.price,
      accommodation,
      cleaningFee,
      serviceFee,
      tax,
      total: accommodation + cleaningFee + serviceFee + tax
    };
  }

  async create(input: CreateBookingDto) {
    return this.queue.serial(`booking:${input.propertyId}`, async () => {
      const quote = this.quote(input);
      if (this.database.hasOverlap(input.propertyId, input.checkIn, input.checkOut)) {
        throw new ConflictException("These dates are no longer available");
      }
      const property = properties.find((item) => item.id === input.propertyId)!;
      const confirmation = `TBS-${randomBytes(3).toString("hex").toUpperCase()}`;
      const booking = await this.database.createBooking({
        confirmation,
        propertyId: input.propertyId,
        guestName: input.guestName,
        email: input.email,
        phone: input.phone,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        total: quote.total,
        status: "confirmed"
      });
      this.cache.invalidate("availability:");
      return {
        confirmation: booking.confirmation,
        propertyName: property.name,
        guestName: booking.guestName,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        total: booking.total,
        status: booking.status
      };
    });
  }

  availability(propertyId: string, checkIn: string, checkOut: string) {
    return this.cache.getOrSet(`availability:${propertyId}:${checkIn}:${checkOut}`, 15_000, () => ({
      propertyId,
      checkIn,
      checkOut,
      available: !this.database.hasOverlap(propertyId, checkIn, checkOut)
    }));
  }
}
