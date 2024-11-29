import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/auth.dto';
import { errorResponse } from '@/utils/helpers/response.helper';
import { RoleService } from '../role/role.service';
import { User } from '@prisma/client';
import { PrismaService } from '@/config/prisma.config';

@Injectable()
export class UserService {
  constructor(
    private readonly roleService: RoleService,
    private prisma: PrismaService,
  ) {}

  async findByEmail(email: string, relationRole: boolean): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        role:
          relationRole == true
            ? {
                select: {
                  id: true,
                  uuid: true,
                  name: true,
                  value: true,
                },
              }
            : undefined,
      },
    });

    return user;
  }

  async findByPhone(phone: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { phone } });

    return user;
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async create({ email, password, name, phone, role }: RegisterDto) {
    const emailUserExists = await this.findByEmail(email, false);

    if (emailUserExists) {
      return errorResponse('Email already exists');
    }

    const phoneUserExists = await this.findByPhone(phone);

    if (phoneUserExists) {
      return errorResponse('Phone already exists');
    }

    const findRole = await this.roleService.findOne(role.uuid);

    if (!findRole) {
      return errorResponse('Role not found');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        phone,
        roleId: findRole.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: {
          select: {
            id: true,
            uuid: true,
            name: true,
            value: true,
          },
        },
      },
    });

    return user;
  }
}
