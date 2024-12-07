import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';
import {
  CreateModulePackageDto,
  UpdateModulePackageDto,
} from './dto/module-package.dto';
import { Filter, UuidDto } from '@/common/dto.common';
import { errorResponse } from '@/utils/helpers/response.helper';
import { paginationResponse, paramPaginate } from '@/utils/helpers/pagination.helper';
import { RoleValue } from '@/constant/enum/role.type';
import { MaterialService } from '../material/material.service';

@Injectable()
export class ModulePackageService {
  constructor(
    private prisma: PrismaService,
    private readonly materialService: MaterialService
  ) { }

  async getModulePackages(params: Filter, user?: any): Promise<any> {
    const { page, per_page, skip, take } = paramPaginate(params);

    const [packages, total] = await this.prisma.$transaction([
      this.prisma.modulePackage.findMany({
        where: user?.role?.value !== RoleValue.ADMIN ? {
          quizzes: {
            some: {}
          }, AND: {
            materials: {
              some: {}
            }
          }
        } : {},
        skip,
        take,
        select: {
          id: true,
          uuid: true,
          title: true,
          description: true,
          price: true,
          durationInMonth: true,
          categories: {
            select: {
              id: true,
              uuid: true,
              title: true,
              value: true,
              type: true,
            },
          },
        },
      }),

      this.prisma.modulePackage.count({
        where: user?.role?.value !== RoleValue.ADMIN ? {
          quizzes: {
            some: {}
          }, AND: {
            materials: {
              some: {}
            }
          }
        } : {}
      }),
    ]);

    return paginationResponse(
      total,
      packages,
      per_page,
      page,
      skip
    )
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
          },
        },
        materials: {
          select: {
            id: true,
            uuid: true,
            title: true,
            materialImage: true,
            materialText: true,
          },
        },
        categories: {
          select: {
            id: true,
            uuid: true,
            title: true,
            value: true,
            type: true,
          },
        },
      },
    });
  }

  async create(dto: CreateModulePackageDto): Promise<any> {
    const { title, description, price, durationInMonth, categories } = dto;

    if (price <= 0) return errorResponse('Price must be greater than 0');

    if (durationInMonth <= 0)
      return errorResponse('Duration must be greater than 0');

    const foundCategory = await Promise.all(
      categories.map(
        async (category: { uuid: string }) =>
          await this.prisma.category.findFirst({
            where: { uuid: category.uuid },
          }),
      ),
    );

    if (!foundCategory) return errorResponse('Category not found');

    const modulePackage = await this.prisma.modulePackage.create({
      data: {
        title,
        description,
        price,
        durationInMonth,
        categories: {
          connect: foundCategory,
        },
      },
    });

    return modulePackage;
  }

  async update(dto: UpdateModulePackageDto): Promise<any> {
    const { uuid, title, description, price, durationInMonth, categories } =
      dto;

    if (price <= 0) return errorResponse('Price must be greater than 0');

    if (durationInMonth <= 0)
      return errorResponse('Duration must be greater than 0');

    const foundCategory = categories
      ? await Promise.all(
        categories.map(
          async (category: { uuid: string }) =>
            await this.prisma.category.findFirst({
              where: { uuid: category.uuid },
            }),
        ),
      )
      : undefined;

    const modulePackage = await this.prisma.modulePackage.update({
      where: { uuid },
      data: {
        title: title ? title : undefined,
        description: description ? description : undefined,
        price: price ? price : undefined,
        durationInMonth: durationInMonth ? durationInMonth : undefined,
        categories: foundCategory
          ? {
            connect: foundCategory,
          }
          : undefined,
      },
    });

    return modulePackage;
  }

  async getModulePackagePurchases(UuidDto: UuidDto, params: Filter): Promise<any> {
    const { uuid } = UuidDto;
    const { page, per_page, skip, take } = paramPaginate(params);

    const modulePackage = await this.prisma.modulePackage.findFirst({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
      }
    })

    if (!modulePackage) return errorResponse('Module package not found');

    const [purchases, total] = await this.prisma.$transaction([
      this.prisma.packagePurchase.findMany({
        where: {
          packageId: modulePackage.id,
        },
        skip,
        take,
        select: {
          id: true,
          uuid: true,
          isActive: true,
          status: {
            select: {
              id: true,
              uuid: true,
              title: true,
              value: true,
            }
          },
          user: {
            select: {
              id: true,
              uuid: true,
              name: true,
              email: true,
            },
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),

      this.prisma.packagePurchase.count({
        where: {
          packageId: modulePackage.id,
        }
      })
    ])

    const newData = {
      ...modulePackage,
      purchases
    }

    return paginationResponse(
      total,
      newData,
      per_page,
      page,
      skip
    )
  }

  async getMaterialsByModulePackage(UuidDto: UuidDto, params: Filter): Promise<any> {
    const { uuid } = UuidDto;

    const modulePackage = await this.prisma.modulePackage.findFirst({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
        description: true,
        price: true,
        durationInMonth: true,
      }
    })

    if (!modulePackage) return errorResponse('Module package not found');

    const paramWhere = {
      packageId: modulePackage.id,
    };

    const materials = await this.materialService.getMaterials(params, paramWhere);

    const newData = {
      ...modulePackage,
      materials: materials?.items,
      meta: materials?.meta
    };

    return newData;
  }
}
