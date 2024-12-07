import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { Filter, UuidDto } from '@/common/dto.common';
import { errorResponse } from '@/utils/helpers/response.helper';
import { paginationResponse, paramPaginate } from '@/utils/helpers/pagination.helper';

@Injectable()
export class MaterialService {
  constructor(
    private prisma: PrismaService
  ) { }

  async getMaterials(params: Filter, where = {}): Promise<any> {
    const { page, per_page, skip, take } = paramPaginate(params);

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.material.findMany({
        skip,
        take,
        where,
        select: {
          id: true,
          uuid: true,
          title: true,
          materialImage: true,
          materialText: true,
        }
      }),

      this.prisma.material.count({
        where
      })
    ])

    return paginationResponse(total, categories, per_page, page, skip);
  }

  async findOne(uuidDto: UuidDto): Promise<any> {
    const { uuid } = uuidDto;
    return await this.prisma.material.findFirst({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
        materialImage: true,
        materialText: true,
      }
    });
  }

  async create(dto: CreateMaterialDto): Promise<any> {
    const {
      title,
      materialText,
      materialImage,
      categories,
      modulePackage,
    } = dto;

    const foundCategory = await Promise.all(categories.map(
      async (item) => {
        const category = await this.prisma.category.findFirst({
          where: { uuid: item.uuid },
        })

        if (!category) errorResponse('Category not found');

        return category;
      }
    ));

    const foundPackageModule = await this.prisma.modulePackage.findFirst({
      where: { uuid: modulePackage.uuid },
    });

    if (!foundPackageModule) return errorResponse('Package module not found');

    const material = await this.prisma.material.create({
      data: {
        title,
        materialText,
        materialImage,
        packageId: foundPackageModule.id,
        categories: {
          connect: foundCategory
        },
      }
    });

    return material;
  }

  async update(dto: UpdateMaterialDto): Promise<any> {
    const {
      uuid,
      title,
      materialText,
      materialImage,
      categories,
      modulePackage,
    } = dto;

    const foundCategory = categories.length > 0 ? await Promise.all(categories.map(
      async (item) => {
        const category = await this.prisma.category.findFirst({
          where: { uuid: item?.uuid },
        })

        if (!category) errorResponse('Category not found');

        return category;
      }
    )) : undefined;

    const foundPackage = modulePackage?.uuid ? await this.prisma.modulePackage.findFirst({
      where: { uuid: modulePackage.uuid },
    }) : undefined;

    if (modulePackage?.uuid && !foundPackage) return errorResponse('Module package not found');

    const material = await this.prisma.material.update({
      where: { uuid },
      data: {
        title: title ? title : undefined,
        materialText: materialText ? materialText : undefined,
        materialImage: materialImage ? materialImage : undefined,
        packageId: foundPackage?.id,
        categories: categories.length > 0 && foundCategory ? {
          connect: foundCategory
        } : undefined,
      }
    });

    return material;
  }
}
