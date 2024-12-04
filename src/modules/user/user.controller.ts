import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AddressService } from '../address/address.service';
import { CreateAddressDto } from '../address/dto/address.dto';
import { Request } from 'express';
import {
  errorResponse,
  successResponse,
} from '@/utils/helpers/response.helper';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class UserController {
  constructor(private readonly addressService: AddressService) {}

  @Post('user/address')
  async setAddress(
    @Body() body: CreateAddressDto,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const data = await this.addressService.createUserAddress(req.user, body);

      return successResponse({ data });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}
