import { PrismaService } from '@/config/prisma.config';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findOne(uuid: string): Promise<Role> {
    const role = await this.prisma.role.findFirst({ where: { uuid } });

    return role;
  }
}
