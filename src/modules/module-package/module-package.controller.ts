import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { successResponse, errorResponse } from '@/utils/helpers/response.helper';
import { Filter } from '@/common/dto.common';
import { ModulePackageService } from './module-package.service';
import { CreateModulePackageDto } from './dto/module-package.dto';

// @ApiBearerAuth('access-token')
@Controller()
export class ModulePackageController {
  constructor(
    private readonly modulePackageService: ModulePackageService,
  ) { }

  @Get('module-packages')
  async findAll(@Query() params: Filter) {
    try {
      const data = await this.modulePackageService.getModulePackages(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Post('module-package')
  async create(@Body() dto: CreateModulePackageDto) {
    try {
      const data = await this.modulePackageService.create(dto);

      return successResponse({ data })
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}
