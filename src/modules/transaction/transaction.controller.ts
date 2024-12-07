import { Body, Controller, Get, Put, Query, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Filter } from "@/common/dto.common";
import { successResponse, errorResponse } from "@/utils/helpers/response.helper";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UpdateTransactionStatusDto } from "./dto/transaction.dto";

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Get('transactions')
  async findAll(@Query() params: Filter) {
    try {
      const data = await this.transactionService.findAll(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Put('transaction/status')
  async update(@Body() params: UpdateTransactionStatusDto) {
    try {
      const data = await this.transactionService.updateStatus(params);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}