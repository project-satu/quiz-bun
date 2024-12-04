import { Filter, UuidDto } from '@/common/dto.common';
import { PrismaService } from '@/config/prisma.config';
import {
  paginationResponse,
  paramPaginate,
} from '@/utils/helpers/pagination.helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: Filter) {
    const pagination = paramPaginate(params);

    const [cities, total] = await this.prisma.$transaction([
      this.prisma.city.findMany({
        skip: pagination.skip,
        take: pagination.take,
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
            },
          },
        },
      }),

      this.prisma.city.count(),
    ]);

    return paginationResponse(
      total,
      cities,
      pagination.per_page,
      pagination.page,
      pagination.skip,
    );
  }

  async findOne(uuidDto: UuidDto) {
    const { uuid } = uuidDto;

    return this.prisma.city.findFirst({
      where: {
        uuid,
      },
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
    });
  }
}
