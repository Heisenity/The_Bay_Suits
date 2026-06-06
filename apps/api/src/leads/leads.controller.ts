import { Body, Controller, Post } from "@nestjs/common";
import { DatabaseService } from "../infrastructure/database.service";
import { MailService } from "../infrastructure/mail.service";

@Controller()
export class LeadsController {
  constructor(
    private readonly database: DatabaseService,
    private readonly mail: MailService
  ) {}

  @Post("contacts")
  async contact(@Body() payload: Record<string, unknown>) {
    await this.database.createLead("contact", payload);
    await this.mail.sendLeadNotification({ kind: "contact", payload });
    return { success: true };
  }

  @Post("assessments")
  async assessment(@Body() payload: Record<string, unknown>) {
    await this.database.createLead("assessment", payload);
    await this.mail.sendLeadNotification({ kind: "assessment", payload });
    return { success: true };
  }
}
