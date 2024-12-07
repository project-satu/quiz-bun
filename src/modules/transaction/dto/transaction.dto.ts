import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString } from "class-validator";
import { TransactionStatusDto } from "./transaction-status.dto";

export class UpdateTransactionStatusDto {
  @ApiProperty({ description: 'Transaction uuid', required: true })
  @IsString()
  uuid: string;

  @ApiProperty()
  @IsObject({
    message: 'status must be an object',
  })
  status: TransactionStatusDto;
}