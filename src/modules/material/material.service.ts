import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { Filter } from '@/common/dto.common';
import { errorResponse, valueExists } from '@/utils/helpers/response.helper';
import { CategoryType } from '@/constant/enum/category-type.enum';

@Injectable()
export class MaterialService {
  constructor(
    private prisma: PrismaService
  ) { }

  async getMaterials(params: Filter): Promise<any> {
    const page = Number(params.page) || 1;
    const per_page = Number(params.per_page) || 10;
    const skip = (page - 1) * per_page;

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.material.findMany({
        skip,
        take: per_page,
        select: {
          id: true,
          uuid: true,
          title: true,
          materialImage: true,
          materialText: true,
          package: {
            select: {
              id: true,
              uuid: true,
              title: true,
              description: true,
              price: true,
              durationInMonth: true,
            }
          }
        }
      }),

      this.prisma.material.count()
    ])

    const last_page = Math.ceil(total / per_page);
    const from = skip + 1;
    const to = Math.min(skip + per_page, total);

    return {
      items: categories,
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
    return await this.prisma.material.findFirst({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
        materialImage: true,
        materialText: true,
        package: {
          select: {
            id: true,
            uuid: true,
            title: true,
            description: true,
            price: true,
            durationInMonth: true,
          }
        }
      }
    });
  }

  async create(dto: CreateMaterialDto): Promise<any> {
    const {
      title,
      materialText,
      materialImage,
      categories,
      modulePacakge,
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

    const foundPackage = await this.prisma.modulePackage.findFirst({
      where: { uuid: modulePacakge.uuid },
    });

    const material = await this.prisma.material.create({
      data: {
        title,
        materialText,
        materialImage,
        packageId: foundPackage.id,
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
      modulePacakge,
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

    const foundPackage = modulePacakge?.uuid ? await this.prisma.modulePackage.findFirst({
      where: { uuid: modulePacakge.uuid },
    }) : undefined;

    if (modulePacakge?.uuid && !foundPackage) return errorResponse('Module package not found');

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
