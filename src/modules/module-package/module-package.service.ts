import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';
import { CreateModulePackageDto } from './dto/module-package.dto';
import { v4 as uuidv4 } from 'uuid';
import { Filter } from '@/common/dto.common';
import { errorResponse } from '@/utils/helpers/response.helper';

@Injectable()
export class ModulePackageService {
  constructor(
    private prisma: PrismaService
  ) { }

  async getModulePackages(params: Filter): Promise<any> {
    const page = Number(params.page) || 1;
    const per_page = Number(params.per_page) || 10;
    const skip = (page - 1) * per_page;

    const [packages, total] = await this.prisma.$transaction([
      this.prisma.modulePackage.findMany({
        skip,
        take: per_page,
        select: {
          id: true,
          uuid: true,
          title: true,
          description: true,
          price: true,
          durationInMonth: true,
          quizzes: {
            select: {
              id: true,
              uuid: true,
              title: true,
              description: true,
            }
          }
        }
      }),
      this.prisma.modulePackage.count()
    ])

    const last_page = Math.ceil(total / per_page);
    const from = skip + 1;
    const to = Math.min(skip + per_page, total);

    return {
      items: packages,
      meta: {
        pagination: {
          total,
          per_page,
          current_page: page,
          last_page,
          from,
          to,
        },
      },
    };
  }

  async findOne(uuid: string): Promise<any> {
    return await this.prisma.modulePackage.findFirst({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
        description: true,
        price: true,
        durationInMonth: true,
        quizzes: {
          select: {
            id: true,
            uuid: true,
            title: true,
            description: true,
          }
        }
      }
    });
  }

  async create(dto: CreateModulePackageDto): Promise<any> {
    const {
      title,
      description,
      price,
      durationInMonth
    } = dto;

    if (price <= 0) return errorResponse('Price must be greater than 0');

    if (durationInMonth <= 0) return errorResponse('Duration must be greater than 0');

    const modulePackage = await this.prisma.modulePackage.create({
      data: {
        title,
        description,
        price,
        durationInMonth,
      }
    });

    return modulePackage;
  }
}
