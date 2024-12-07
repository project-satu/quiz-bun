import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TransactionStatusDto {
  @ApiProperty()
  @IsString()
  value?: string;

  @ApiProperty()
  @IsString()
  uuid?: string;
}