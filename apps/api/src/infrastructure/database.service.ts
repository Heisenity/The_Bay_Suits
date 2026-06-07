import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool } from "pg";
import { randomUUID } from "node:crypto";

export type BookingRecord = {
  id: string;
  confirmation: string;
  propertyId: string;
  guestName: string;
  email: string;
  phone?: string;
  notes?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: string;
  createdAt: string;
};

type MessageRecord = {
  id: string;
  conversationId: string;
  author: string;
  text: string;
  createdAt: string;
};

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool?: Pool;
  private bookings: BookingRecord[] = [];
  private leads: Array<Record<string, unknown>> = [];
  private messages: MessageRecord[] = [];

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      this.logger.warn("DATABASE_URL not set; using in-memory persistence.");
      return;
    }
    try {
      this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
      await this.pool.query("select 1");
      await this.initializeSchema();
      const result = await this.pool.query<BookingRecord>(
        `select id, confirmation, property_id as "propertyId", guest_name as "guestName", email, phone, notes,
         check_in::text as "checkIn", check_out::text as "checkOut", guests, total::float, status,
         created_at::text as "createdAt" from bookings`
      );
      this.bookings = result.rows;
      const messageResult = await this.pool.query<MessageRecord>(
        `select id, conversation_id as "conversationId", author, body as text, created_at::text as "createdAt"
         from messages
         order by created_at asc`
      );
      this.messages = messageResult.rows;
      this.logger.log("Connected to PostgreSQL.");
    } catch (error) {
      this.logger.error(`PostgreSQL unavailable; using in-memory persistence. ${String(error)}`);
      await this.pool?.end().catch(() => undefined);
      this.pool = undefined;
    }
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }

  private async initializeSchema() {
    await this.pool!.query(`
      create table if not exists bookings (
        id uuid primary key,
        confirmation varchar(32) unique not null,
        property_id varchar(80) not null,
        guest_name varchar(160) not null,
        email varchar(255) not null,
        phone varchar(80),
        notes text,
        check_in date not null,
        check_out date not null,
        guests integer not null,
        total numeric(12,2) not null,
        status varchar(40) not null default 'confirmed',
        created_at timestamptz not null default now(),
        constraint valid_booking_dates check (check_out > check_in)
      );
      create index if not exists bookings_property_dates_idx on bookings(property_id, check_in, check_out);
      alter table bookings add column if not exists notes text;
      create table if not exists leads (
        id uuid primary key,
        kind varchar(40) not null,
        payload jsonb not null,
        created_at timestamptz not null default now()
      );
      create table if not exists messages (
        id uuid primary key,
        conversation_id varchar(100) not null,
        author varchar(40) not null,
        body text not null,
        created_at timestamptz not null default now()
      );
      create table if not exists webhook_events (
        id uuid primary key,
        provider varchar(80) not null,
        external_id varchar(255),
        payload jsonb not null,
        received_at timestamptz not null default now()
      );
    `);
  }

  listBookings() {
    return this.bookings;
  }

  findBookingByConfirmation(confirmation: string) {
    return this.bookings.find((booking) => booking.confirmation.toUpperCase() === confirmation.toUpperCase());
  }

  hasOverlap(propertyId: string, checkIn: string, checkOut: string) {
    return this.bookings.some(
      (booking) =>
        booking.propertyId === propertyId &&
        booking.status !== "cancelled" &&
        checkIn < booking.checkOut &&
        checkOut > booking.checkIn
    );
  }

  hasOverlapExcludingBooking(propertyId: string, checkIn: string, checkOut: string, bookingId: string) {
    return this.bookings.some(
      (booking) =>
        booking.id !== bookingId &&
        booking.propertyId === propertyId &&
        booking.status !== "cancelled" &&
        checkIn < booking.checkOut &&
        checkOut > booking.checkIn
    );
  }

  async createBooking(record: Omit<BookingRecord, "id" | "createdAt">) {
    const booking: BookingRecord = { ...record, id: randomUUID(), createdAt: new Date().toISOString() };
    if (this.pool) {
      await this.pool.query(
        `insert into bookings
          (id, confirmation, property_id, guest_name, email, phone, notes, check_in, check_out, guests, total, status)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [booking.id, booking.confirmation, booking.propertyId, booking.guestName, booking.email, booking.phone || null, booking.notes || null, booking.checkIn, booking.checkOut, booking.guests, booking.total, booking.status]
      );
    }
    this.bookings.push(booking);
    return booking;
  }

  async createLead(kind: string, payload: Record<string, unknown>) {
    const lead = { id: randomUUID(), kind, payload, createdAt: new Date().toISOString() };
    if (this.pool) await this.pool.query("insert into leads (id, kind, payload) values ($1,$2,$3)", [lead.id, kind, JSON.stringify(payload)]);
    this.leads.push(lead);
    return lead;
  }

  async createMessage(payload: { id?: string; conversationId: string; author: string; text: string; createdAt?: string }) {
    const message: MessageRecord = { ...payload, id: payload.id || randomUUID(), createdAt: payload.createdAt || new Date().toISOString() };
    if (this.pool) await this.pool.query("insert into messages (id, conversation_id, author, body, created_at) values ($1,$2,$3,$4,$5)", [message.id, message.conversationId, message.author, message.text, message.createdAt]);
    this.messages.push(message);
    return message;
  }

  listMessages(conversationId: string) {
    return this.messages
      .filter((message) => message.conversationId === conversationId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  async extendBooking(bookingId: string, nextCheckOut: string, nextTotal: number) {
    if (this.pool) {
      await this.pool.query("update bookings set check_out = $1, total = $2 where id = $3", [nextCheckOut, nextTotal, bookingId]);
    }
    this.bookings = this.bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, checkOut: nextCheckOut, total: nextTotal } : booking
    );
    return this.bookings.find((booking) => booking.id === bookingId)!;
  }

  async createWebhook(provider: string, externalId: string | undefined, payload: Record<string, unknown>) {
    if (this.pool) await this.pool.query("insert into webhook_events (id, provider, external_id, payload) values ($1,$2,$3,$4)", [randomUUID(), provider, externalId || null, JSON.stringify(payload)]);
    return { accepted: true };
  }
}
