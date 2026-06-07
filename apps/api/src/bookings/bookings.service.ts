import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { randomBytes } from "node:crypto";
import { getArrivalGuide } from "../arrival-guides";
import { properties } from "../data";
import { CacheService } from "../infrastructure/cache.service";
import { DatabaseService } from "../infrastructure/database.service";
import { MailService } from "../infrastructure/mail.service";
import { QueueService } from "../infrastructure/queue.service";
import { CreateBookingDto, QuoteDto } from "./bookings.dto";

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly database: DatabaseService,
    private readonly queue: QueueService,
    private readonly cache: CacheService,
    private readonly mail: MailService
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
      this.validateDemoPayment(input);
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
        notes: input.notes,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        total: quote.total,
        status: "confirmed"
      });
      this.cache.invalidate("availability:");
      this.cache.invalidate(`reservation:${booking.confirmation}`);
      await this.mail
        .sendBookingNotifications({
          confirmation: booking.confirmation,
          propertyName: property.name,
          guestName: booking.guestName,
          email: booking.email,
          phone: booking.phone,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          total: booking.total,
          notes: input.notes
        })
        .catch((error) => this.logger.error(`Booking email flow failed: ${String(error)}`));
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

  reservation(confirmation: string) {
    return this.cache.getOrSet(`reservation:${confirmation.toUpperCase()}`, 15_000, () => {
      const booking = this.database.findBookingByConfirmation(confirmation);
      if (!booking) throw new NotFoundException("Reservation not found");
      const property = properties.find((item) => item.id === booking.propertyId);
      if (!property) throw new NotFoundException("Property not found");
      const arrivalGuide = getArrivalGuide(property.id);
      const releaseAt = new Date(`${booking.checkIn}T15:00:00Z`);
      releaseAt.setHours(releaseAt.getHours() - 48);
      const arrivalUnlocked = Date.now() >= releaseAt.getTime();

      return {
        confirmation: booking.confirmation,
        conversationId: `booking:${booking.confirmation}`,
        guestName: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        total: booking.total,
        status: booking.status,
        property: {
          id: property.id,
          slug: property.slug,
          name: property.name,
          location: property.location,
          price: property.price
        },
        arrivalGuide: {
          ...arrivalGuide,
          available: arrivalUnlocked,
          releaseAt: releaseAt.toISOString()
        }
      };
    });
  }

  conversation(confirmation: string) {
    const booking = this.database.findBookingByConfirmation(confirmation);
    if (!booking) throw new NotFoundException("Reservation not found");
    return this.database.listMessages(`booking:${booking.confirmation}`);
  }

  async sendInvoice(confirmation: string) {
    const booking = this.database.findBookingByConfirmation(confirmation);
    if (!booking) throw new NotFoundException("Reservation not found");
    const property = properties.find((item) => item.id === booking.propertyId);
    if (!property) throw new NotFoundException("Property not found");

    await this.mail.sendInvoiceNotification({
      confirmation: booking.confirmation,
      propertyName: property.name,
      guestName: booking.guestName,
      email: booking.email,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      total: booking.total
    });

    return {
      success: true,
      message: `Your invoice PDF is on its way to ${booking.email}.`
    };
  }

  async extendStay(confirmation: string, nextCheckOut: string) {
    const booking = this.database.findBookingByConfirmation(confirmation);
    if (!booking) throw new NotFoundException("Reservation not found");
    const property = properties.find((item) => item.id === booking.propertyId);
    if (!property) throw new NotFoundException("Property not found");

    return this.queue.serial(`booking:${booking.propertyId}`, async () => {
      if (nextCheckOut <= booking.checkOut) {
        throw new BadRequestException("Choose a new check-out date after your current departure date");
      }
      if (this.database.hasOverlapExcludingBooking(booking.propertyId, booking.checkIn, nextCheckOut, booking.id)) {
        throw new ConflictException("Those additional nights are no longer open. Please choose another departure date.");
      }

      const currentDeparture = new Date(`${booking.checkOut}T12:00:00Z`);
      const requestedDeparture = new Date(`${nextCheckOut}T12:00:00Z`);
      const extraNights = Math.round((requestedDeparture.getTime() - currentDeparture.getTime()) / 86400000);

      if (!Number.isFinite(extraNights) || extraNights < 1) {
        throw new BadRequestException("Choose a valid extended departure date");
      }

      const extraAccommodation = property.price * extraNights;
      const extraTax = Math.round(extraAccommodation * 0.13);
      const updatedTotal = booking.total + extraAccommodation + extraTax;
      const updatedBooking = await this.database.extendBooking(booking.id, nextCheckOut, updatedTotal);
      this.cache.invalidate("availability:");
      this.cache.invalidate(`reservation:${booking.confirmation}`);

      await this.mail.sendExtendStayNotification({
        confirmation: updatedBooking.confirmation,
        propertyName: property.name,
        guestName: updatedBooking.guestName,
        email: updatedBooking.email,
        checkOut: updatedBooking.checkOut,
        total: updatedBooking.total
      });

      return {
        confirmation: updatedBooking.confirmation,
        checkOut: updatedBooking.checkOut,
        total: updatedBooking.total,
        addedNights: extraNights
      };
    });
  }

  monthAvailability(propertyId: string, month: string) {
    const property = properties.find((item) => item.id === propertyId);
    if (!property) throw new NotFoundException("Property not found");

    const [yearString, monthString] = month.split("-");
    const year = Number(yearString);
    const monthIndex = Number(monthString) - 1;
    if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      throw new BadRequestException("Use a month like 2026-06");
    }

    const monthStart = new Date(Date.UTC(year, monthIndex, 1));
    const nextMonthStart = new Date(Date.UTC(year, monthIndex + 1, 1));
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const reservedDays = new Set<number>();

    for (const booking of this.database.listBookings()) {
      if (booking.propertyId !== propertyId || booking.status === "cancelled") continue;
      const bookingStart = new Date(`${booking.checkIn}T00:00:00Z`);
      const bookingEnd = new Date(`${booking.checkOut}T00:00:00Z`);
      if (bookingEnd <= monthStart || bookingStart >= nextMonthStart) continue;

      const rangeStart = new Date(Math.max(bookingStart.getTime(), monthStart.getTime()));
      const rangeEnd = new Date(Math.min(bookingEnd.getTime(), nextMonthStart.getTime()));

      for (let cursor = new Date(rangeStart); cursor < rangeEnd; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
        reservedDays.add(cursor.getUTCDate());
      }
    }

    return {
      propertyId,
      month,
      monthLabel: monthStart.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
      daysInMonth,
      startsOn: monthStart.getUTCDay(),
      reservedDays: [...reservedDays].sort((left, right) => left - right)
    };
  }

  private validateDemoPayment(input: CreateBookingDto) {
    const cardNumber = input.cardNumber.replace(/\s+/g, "");
    const cardExpiry = input.cardExpiry.trim();
    const cardCvv = input.cardCvv.trim();

    if (cardNumber !== "123456789") {
      throw new BadRequestException("Demo card number must be 123456789");
    }
    if (cardCvv !== "000") {
      throw new BadRequestException("Demo CVV must be 000");
    }
    if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2,4}$/.test(cardExpiry)) {
      throw new BadRequestException("Enter an expiry date like 12 / 30");
    }
  }
}
