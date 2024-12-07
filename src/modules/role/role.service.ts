import { Filter } from '@/common/dto.common';
import { PrismaService } from '@/config/prisma.config';
import { paginationResponse, paramPaginate } from '@/utils/helpers/pagination.helper';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) { }

  async findOne(uuid: string): Promise<Role> {
    const role = await this.prisma.role.findFirst({ where: { uuid } });

    return role;
  }

  async findAll(params: Filter): Promise<any> {
    const { page, per_page, skip, take } = paramPaginate(params);

    const [roles, total] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        skip,
        take,
        select: {
          id: true,
          uuid: true,
          name: true,
          value: true,
        },
      }),

      this.prisma.role.count(),
    ])

    return paginationResponse(
      total,
      roles,
      per_page,
      page,
      skip
    );
  }
}
