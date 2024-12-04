import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';
import { BulkCreateCategoryDto, CreateCategoryDto } from './dto/category.dto';
import { Filter } from '@/common/dto.common';
import { valueExists } from '@/utils/helpers/response.helper';
import { CategoryType } from '@/constant/enum/category-type.enum';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories(params: Filter): Promise<any> {
    const page = Number(params.page) || 1;
    const per_page = Number(params.per_page) || 10;
    const skip = (page - 1) * per_page;

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take: per_page,
        select: {
          id: true,
          uuid: true,
          title: true,
          value: true,
          type: true,
        },
      }),

      this.prisma.category.count(),
    ]);

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
      },
    });
  }

  async create(dto: BulkCreateCategoryDto): Promise<any> {
    const { data } = dto;

    if (!Array.isArray(data) || data.length <= 0) {
      throw new Error('No data provided');
    }

    if (
      !data.every((item: CreateCategoryDto) =>
        Object.values(CategoryType).includes(item.type),
      )
    ) {
      throw new Error('Invalid category type');
    }

    const existingCategories = await this.prisma.category.findMany({
      select: { value: true },
    });

    valueExists(data, existingCategories);

    try {
      const categories = await this.prisma.category.createMany({
        data: data.map((item: CreateCategoryDto) => ({
          title: item.title,
          value: item.value,
          type: item.type,
        })),
      });

      return categories.count !== 0
        ? 'Categories created successfully'
        : 'No categories created';
    } catch (error) {
      throw new Error('Error creating categories: ' + error.message);
    }
  }
}
