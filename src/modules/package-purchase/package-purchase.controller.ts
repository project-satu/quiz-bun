import { Body, Controller, Post, Req } from '@nestjs/common';
import { PackagePurchaseService } from './package-purchase.service';
import { CreatePackagePurchaseDto } from './dto/package-purchase.dto';
import { Request } from 'express';
import {
  errorResponse,
  successResponse,
} from '@/utils/helpers/response.helper';

@Controller()
export class PackagePurchaseController {
  constructor(
    private readonly packagePurchaseService: PackagePurchaseService,
  ) { }

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
