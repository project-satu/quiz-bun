import { PrismaService } from '@/config/prisma.config';
import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/address.dto';
import { CityService } from '../city/city.service';
import { errorResponse } from '@/utils/helpers/response.helper';

@Injectable()
export class AddressService {
  constructor(
    private prisma: PrismaService,
    private cityService: CityService,
  ) {}

  async createUserAddress(userLogin: any, addressDto: CreateAddressDto) {
    const { city, fullAddress } = addressDto;

    const foundCity = await this.cityService.findOne(city);

    if (!foundCity) return errorResponse('city not found');

    const address = await this.prisma.address.create({
      data: {
        cityId: foundCity.id,
        fullAddress,
        userId: userLogin.id,
      },
      select: {
        id: true,
        uuid: true,
        fullAddress: true,
        city: {
          select: {
            id: true,
            uuid: true,
            name: true,
            province: {
              select: {
                id: true,
                uuid: true,
                name: true,
                value: true,
                provincialCapital: true,
              },
            },
          },
        },
      },
    });

    return address;
  }
}
