import {
  errorResponse,
  successResponse,
} from '@/utils/helpers/response.helper';
import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { Filter } from '@/common/dto.common';

@Controller()
export class CityController {
  constructor(private cityService: CityService) {}

  @Get('cities')
  async getCities(@Query() params: Filter): Promise<any> {
    try {
      const cities = await this.cityService.findAll(params);

      return successResponse({ data: cities, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error);
    }
  }
}
