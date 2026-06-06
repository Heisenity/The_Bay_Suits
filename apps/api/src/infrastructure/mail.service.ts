import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { BrevoClient } from "@getbrevo/brevo";

type LeadNotificationInput = {
  kind: string;
  payload: Record<string, unknown>;
};

type BookingNotificationInput = {
  confirmation: string;
  propertyName: string;
  guestName: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  notes?: string;
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private client?: BrevoClient;
  private fromAddress?: string;
  private notificationEmail?: string;
  private ready = false;

  onModuleInit() {
    const apiKey = process.env.BREVO_API_KEY;
    this.fromAddress = process.env.BREVO_FROM;
    this.notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!apiKey || !this.fromAddress) {
      this.logger.warn("Brevo settings are incomplete; email notifications are disabled.");
      return;
    }

    this.client = new BrevoClient({ apiKey });
    this.ready = true;
    this.logger.log("Brevo mailer is ready.");
  }

  async sendLeadNotification({ kind, payload }: LeadNotificationInput) {
    if (!this.notificationEmail) {
      this.logger.warn("NOTIFICATION_EMAIL not set; skipping lead notification email.");
      return;
    }

    const rows = this.renderRows(payload);
    const replyTo = typeof payload.email === "string" ? payload.email : undefined;
    await this.send({
      to: this.notificationEmail,
      subject: `[The Bay Suites] New ${kind} submission`,
      replyTo,
      text: `A new ${kind} form was submitted.\n\n${rows.text}`,
      html: this.wrapHtml(`A new ${kind} form was submitted.`, rows.html)
    });
  }

  async sendBookingNotifications(input: BookingNotificationInput) {
    const adminPromise = this.notificationEmail
      ? this.send({
          to: this.notificationEmail,
          subject: `[The Bay Suites] New booking ${input.confirmation}`,
          replyTo: input.email,
          text: this.bookingAdminText(input),
          html: this.wrapHtml("A new booking was confirmed.", this.bookingDetailsHtml(input, true))
        })
      : Promise.resolve();

    const guestPromise = this.send({
      to: input.email,
      subject: `Your Bay Suites booking is confirmed (${input.confirmation})`,
      text: this.bookingGuestText(input),
      html: this.wrapHtml("Your Bay Suites booking is confirmed.", this.bookingDetailsHtml(input, false))
    });

    await Promise.allSettled([adminPromise, guestPromise]);
  }

  private async send({
    to,
    subject,
    text,
    html,
    replyTo
  }: {
    to: string;
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
  }) {
    if (!this.ready || !this.client || !this.fromAddress) {
      this.logger.warn(`Email skipped for "${subject}" because the mailer is not configured.`);
      return;
    }

    try {
      const [senderName, senderEmail] = this.parseSender(this.fromAddress);
      await this.client.transactionalEmails.sendTransacEmail({
        subject,
        textContent: text,
        htmlContent: html,
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [{ email: to }],
        replyTo: replyTo ? { email: replyTo } : undefined
      });
    } catch (error) {
      this.logger.error(`Email delivery failed for "${subject}": ${String(error)}`);
    }
  }

  private renderRows(payload: Record<string, unknown>) {
    const entries = Object.entries(payload).filter(([, value]) => value !== undefined && value !== "");
    return {
      text: entries.map(([key, value]) => `${this.toLabel(key)}: ${String(value)}`).join("\n"),
      html: `<table style="width:100%;border-collapse:collapse">${entries
        .map(
          ([key, value]) =>
            `<tr><td style="padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em">${this.escapeHtml(
              this.toLabel(key)
            )}</td><td style="padding:8px 0;color:#111827;font-size:14px">${this.escapeHtml(String(value))}</td></tr>`
        )
        .join("")}</table>`
    };
  }

  private bookingAdminText(input: BookingNotificationInput) {
    return [
      `Confirmation: ${input.confirmation}`,
      `Property: ${input.propertyName}`,
      `Guest: ${input.guestName}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || "Not provided"}`,
      `Check-in: ${input.checkIn}`,
      `Check-out: ${input.checkOut}`,
      `Guests: ${input.guests}`,
      `Total: CAD ${input.total.toFixed(2)}`,
      `Notes: ${input.notes || "None"}`
    ].join("\n");
  }

  private bookingGuestText(input: BookingNotificationInput) {
    return [
      `Hello ${input.guestName},`,
      "",
      `Your Bay Suites booking is confirmed.`,
      `Confirmation: ${input.confirmation}`,
      `Property: ${input.propertyName}`,
      `Check-in: ${input.checkIn}`,
      `Check-out: ${input.checkOut}`,
      `Guests: ${input.guests}`,
      `Total: CAD ${input.total.toFixed(2)}`,
      "",
      "If you need anything before arrival, reply to this email or contact our guest support team."
    ].join("\n");
  }

  private bookingDetailsHtml(input: BookingNotificationInput, includeContact: boolean) {
    const rows: Array<[string, string]> = [
      ["Confirmation", input.confirmation],
      ["Property", input.propertyName],
      ["Guest", input.guestName],
      ["Check-in", input.checkIn],
      ["Check-out", input.checkOut],
      ["Guests", String(input.guests)],
      ["Total", `CAD ${input.total.toFixed(2)}`]
    ];

    if (includeContact) {
      rows.splice(3, 0, ["Email", input.email], ["Phone", input.phone || "Not provided"]);
      rows.push(["Notes", input.notes || "None"]);
    }

    return `<table style="width:100%;border-collapse:collapse">${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em">${this.escapeHtml(
            label
          )}</td><td style="padding:8px 0;color:#111827;font-size:14px">${this.escapeHtml(value)}</td></tr>`
      )
      .join("")}</table>`;
  }

  private wrapHtml(title: string, content: string) {
    return `
      <div style="background:#f8f6f1;padding:24px;font-family:Arial,sans-serif;color:#111827">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;border:1px solid #e5e7eb">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#b89657">The Bay Suites</p>
          <h1 style="margin:0 0 20px;font-size:28px;line-height:1.1;color:#0f1f35">${this.escapeHtml(title)}</h1>
          ${content}
        </div>
      </div>
    `;
  }

  private toLabel(key: string) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  }

  private parseSender(value: string): [string, string] {
    const match = value.match(/^(.*?)\s*<([^>]+)>$/);
    if (match) return [match[1].trim(), match[2].trim()];
    return ["The Bay Suites", value.trim()];
  }

  private escapeHtml(value: string) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}
