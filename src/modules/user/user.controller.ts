import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AddressService } from '../address/address.service';
import { CreateAddressDto } from '../address/dto/address.dto';
import { Request } from 'express';
import {
  errorResponse,
  successResponse,
} from '@/utils/helpers/response.helper';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';
import { UuidDto } from '@/common/dto.common';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class UserController {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService
  ) { }

  @Get('users')
  async getUsers(@Req() req: Request) {
    try {
      return successResponse({
        data: req.user,
      });
    } catch (error) {
      return errorResponse(error.message, error.status);
    }
  }

  @Get('user/details')
  async getUser(dto: UuidDto) {
    try {
      const data = await this.userService.userDetails(dto);

      return successResponse({ data });
    } catch (error) {
      return errorResponse(error.message, error.status);
    }
  }

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
