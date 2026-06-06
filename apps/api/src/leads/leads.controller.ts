import { Body, Controller, Post } from "@nestjs/common";
import { DatabaseService } from "../infrastructure/database.service";

@Controller()
export class LeadsController {
  constructor(private readonly database: DatabaseService) {}

  @Post("contacts")
  async contact(@Body() payload: Record<string, unknown>) {
    await this.database.createLead("contact", payload);
    return { success: true };
  }

  @Post("assessments")
  async assessment(@Body() payload: Record<string, unknown>) {
    await this.database.createLead("assessment", payload);
    return { success: true };
  }
}
