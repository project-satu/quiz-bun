import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { successResponse, errorResponse } from '@/utils/helpers/response.helper';
import { Filter } from '@/common/dto.common';
import { MaterialService } from './material.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';

// @ApiBearerAuth('access-token')
@Controller()
export class MaterialController {
  constructor(
    private readonly materialService: MaterialService,
  ) { }

  @Get('materials')
  async findAll(@Query() params: Filter) {
    try {
      const data = await this.materialService.getMaterials(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Get('material')
  async findOne(@Query() params: string) {
    try {
      const data = await this.materialService.findOne(params);
      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Post('material')
  async create(@Body() dto: CreateMaterialDto) {
    try {
      const data = await this.materialService.create(dto);

      return successResponse({ data })
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Put('material')
  async update(@Body() dto: UpdateMaterialDto) {
    try {
      const data = await this.materialService.update(dto);

      return successResponse({ data })
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}
