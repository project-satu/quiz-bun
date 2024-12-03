import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { Filter } from "@/common/dto.common";
import { successResponse, errorResponse } from "@/utils/helpers/response.helper";
import { CreteTagParentDto } from "./dto/tag.dto";

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Get('tags')
  async findAll(@Query() params: Filter) {
    try {
      const data = await this.tagService.getTags(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Get('tag/parents')
  async getParentTags(@Query() params: Filter) {
    try {
      const data = await this.tagService.getParentTags(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Get('tag/childrens')
  async getChildrenTags(@Query() params: Filter) {
    try {
      const data = await this.tagService.getChildTags(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Post('tag/parent')
  async create(@Body() dto: CreteTagParentDto) {
    try {
      const data = await this.tagService.createParent(dto);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Post('tag/child')
  async createChild(@Body() dto: CreteTagParentDto) {
    try {
      const data = await this.tagService.createChild(dto);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Put('tag/parent')
  async updateParent(@Body() dto: CreteTagParentDto) {
    try {
      const data = await this.tagService.updateParent(dto);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Put('tag/child')
  async updateChild(@Body() dto: CreteTagParentDto) {
    try {
      const data = await this.tagService.updateChild(dto);
      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}