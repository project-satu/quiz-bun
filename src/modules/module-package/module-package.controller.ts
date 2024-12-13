import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  successResponse,
  errorResponse,
} from '@/utils/helpers/response.helper';
import { Filter, UuidDto } from '@/common/dto.common';
import { ModulePackageService } from './module-package.service';
import {
  CreateModulePackageDto,
  UpdateModulePackageDto,
} from './dto/module-package.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { PackagePurchaseService } from '../package-purchase/package-purchase.service';
import { CreatePackagePurchaseDto } from '../package-purchase/dto/package-purchase.dto';

@Controller()
export class ModulePackageController {
  constructor(
    private readonly modulePackageService: ModulePackageService,
    private readonly packagePurchaseService: PackagePurchaseService,
  ) { }

  @Get('module-packages')
  async getModulePackages(@Query() params: Filter) {
    try {
      const data = await this.modulePackageService.getModulePackages(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Get('moderator/module-packages')
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() params: Filter, @Req() req: Request) {
    try {
      const data = await this.modulePackageService.getModulePackages(params, req.user);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Get('module-package/materials')
  @UseGuards(JwtAuthGuard)
  async getMaterialsByModulePackage(
    @Query() params: Filter,
    @Query() dto: UuidDto,
  ) {
    try {
      const data = await this.modulePackageService.getMaterialsByModulePackage(dto, params);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Get('module-package/quizzes')
  @UseGuards(JwtAuthGuard)
  async getQuizzesByModulePackage(
    @Query() params: Filter,
    @Query() dto: UuidDto,
  ) {
    try {
      const data = await this.modulePackageService.getQuizzesByModulePackage(dto, params);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Post('module-package')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateModulePackageDto) {
    try {
      const data = await this.modulePackageService.create(dto);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Put('module-package')
  @UseGuards(JwtAuthGuard)
  async update(@Body() dto: UpdateModulePackageDto) {
    try {
      const data = await this.modulePackageService.update(dto);
      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Post('module-package/checkout')
  @UseGuards(JwtAuthGuard)
  async chaeckoutModulePackage(
    @Body() dto: CreatePackagePurchaseDto,
    @Req() req: Request,
  ) {
    try {
      const data = await this.packagePurchaseService.create(dto, req.user);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Post('module-package/purchases')
  @UseGuards(JwtAuthGuard)
  async checkoutModulePackage(
    @Query() params: Filter,
    @Query() dto: UuidDto,
  ) {
    try {
      const data = await this.modulePackageService.getModulePackagePurchases(dto, params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}
