import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PackagePurchaseService } from './package-purchase.service';
import { CreatePackagePurchaseDto } from './dto/package-purchase.dto';
import { Request } from 'express';
import {
  errorResponse,
  successResponse,
} from '@/utils/helpers/response.helper';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Filter } from '@/common/dto.common';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class PackagePurchaseController {
  constructor(
    private readonly packagePurchaseService: PackagePurchaseService,
  ) { }

  @Get('package-purchases')
  async getAllPackagePurchases(@Query() params: Filter) {
    try {
      const data = await this.packagePurchaseService.findAll(params);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Post('package-purchase')
  async create(@Body() dto: CreatePackagePurchaseDto, @Req() req: Request) {
    try {
      const data = await this.packagePurchaseService.create(dto, req.user);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}
