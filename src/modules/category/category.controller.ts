import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { successResponse, errorResponse } from '@/utils/helpers/response.helper';
import { Filter } from '@/common/dto.common';
import { CategoryService } from './category.service';
import { BulkCreateCategoryDto, CreateCategoryDto } from './dto/category.dto';
import { ApiParam } from '@nestjs/swagger';

// @ApiBearerAuth('access-token')
@Controller()
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Get('categories')
  async findAll(@Query() params: Filter) {
    try {
      const data = await this.categoryService.getCategories(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Get('category')
  @ApiParam({ name: 'uuid', type: 'string' })
  async findOne(@Query() params: string) {
    try {
      const data = await this.categoryService.findOne(params);
      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Post('category')
  async create(@Body() dto: BulkCreateCategoryDto) {
    try {
      const data = await this.categoryService.create(dto);

      return successResponse({ data })
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}
