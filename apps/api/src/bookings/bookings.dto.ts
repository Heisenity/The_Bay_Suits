import { IsDateString, IsEmail, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class QuoteDto {
  @IsString()
  propertyId!: string;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  guests!: number;
}

export class CreateBookingDto extends QuoteDto {
  @IsString()
  guestName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  cardNumber!: string;

  @IsString()
  cardExpiry!: string;

  @IsString()
  cardCvv!: string;
}

export class ExtendStayDto {
  @IsDateString()
  checkOut!: string;
}
