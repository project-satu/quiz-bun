import { Controller, Get, Query } from "@nestjs/common";
import { RoleService } from "./role.service";
import { Filter } from "@/common/dto.common";
import { errorResponse, successResponse } from "@/utils/helpers/response.helper";

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Get('roles')
  async findAll(@Query() params: Filter) {
    try {
      const data = await this.roleService.findAll(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}