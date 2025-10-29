import { IsOptional, IsNumber, IsString } from "class-validator";

export class GetAlertsDto {
  @IsOptional() @IsString() startTime?: string;
  @IsOptional() @IsString() endTime?: string;
  @IsOptional() @IsString() pair?: string;
  @IsOptional() @IsNumber() minRate?: number;
  @IsOptional() @IsNumber() maxRate?: number;
  @IsOptional() @IsNumber() botId?: number;
  @IsOptional() @IsNumber() configId?: number;
  @IsOptional() @IsNumber() limit?: number = 10;
  @IsOptional() @IsNumber() offset?: number = 0;
}
