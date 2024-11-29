import { PrismaService } from "@/config/prisma.config";
import { Injectable } from "@nestjs/common";
import { CreateTagChildDto, CreteTagParentDto, UpdateTagChildDto, UpdateTagParentDto } from "./dto/tag.dto";
import { CategoryService } from "../category/category.service";
import { errorResponse } from "@/utils/helpers/response.helper";
import { Filter } from "@/common/dto.common";

@Injectable()
export class TagService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService
  ) { }

  async getTags(params: Filter, level?: number): Promise<any> {
    const page = Number(params.page) || 1;
    const per_page = Number(params.per_page) || 10;
    const skip = (page - 1) * per_page;

    const [tags, total] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        skip,
        take: per_page,
        where: {
          level: level ? level : undefined
        },
        select: {
          id: true,
          uuid: true,
          title: true,
          value: true,
          level: true,
          parent: {
            select: {
              id: true,
              uuid: true,
              title: true,
              value: true,
              level: true
            }
          },
          category: {
            select: {
              id: true,
              uuid: true,
              title: true,
              value: true,
              type: true
            }
          }
        }
      }),

      this.prisma.tag.count()
    ])

    const last_page = Math.ceil(total / per_page);
    const from = skip + 1;
    const to = Math.min(skip + per_page, total);

    return {
      items: tags,
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

  async getParentTags(params: Filter): Promise<any> {
    const parents = await this.getTags(params, 1);

    return parents;
  }

  async getChildTags(params: Filter): Promise<any> {
    const childrens = await this.getTags(params, 2);

    return childrens;
  }

  async createParent(dto: CreteTagParentDto): Promise<any> {
    const {
      category,
      level,
      title,
      value
    } = dto

    if (level <= 0 && level !== 1) return errorResponse('Level must be greater than 0 or 1');

    const foundCategory = await this.prisma.category.findFirst({
      where: {
        uuid: category.uuid
      }
    });

    if (!foundCategory) return errorResponse('Category not found');

    const existingTag = await this.prisma.tag.findMany({
      where: {
        value
      }
    })

    if (existingTag.length > 0) return errorResponse('Tag already exists');

    const tag = await this.prisma.tag.create({
      data: {
        categoryId: foundCategory.id,
        level,
        title,
        value
      },
      select: {
        id: true,
        uuid: true,
        title: true,
        value: true,
        category: {
          select: {
            id: true,
            uuid: true,
            title: true,
            value: true,
            type: true
          }
        }
      }
    });

    return tag;
  }

  async createChild(dto: CreateTagChildDto): Promise<any> {
    const {
      category,
      level,
      title,
      value,
      tagParent
    } = dto

    const existingTag = await this.prisma.tag.findMany({
      where: {
        value
      }
    })

    if (existingTag.length > 0) return errorResponse('Tag already exists');

    const foundTagParent = await this.prisma.tag.findFirst({
      where: { uuid: tagParent.uuid }
    });

    if (!foundTagParent) return errorResponse('Tag parent not found');

    const foundCategory = await this.categoryService.findOne(category.uuid);

    if (!foundCategory) return errorResponse('Category not found');

    if (level >= foundTagParent.level && level <= 1) return errorResponse('Invalid level');

    const tag = await this.prisma.tag.create({
      data: {
        parentId: foundTagParent.id,
        level,
        title,
        value
      },
      select: {
        id: true,
        uuid: true,
        title: true,
        value: true,
        category: {
          select: {
            id: true,
            uuid: true,
            title: true,
            value: true,
            type: true
          }
        }
      }
    });

    return tag;
  }

  async updateParent(dto: UpdateTagParentDto): Promise<any> {
    const {
      category,
      title,
      uuid
    } = dto

    const foundTag = await this.prisma.tag.findFirst({
      where: { uuid }
    });

    if (!foundTag) return errorResponse('Tag not found');

    const foundCategory = category.uuid ? await this.prisma.category.findFirst({
      where: {
        uuid: category.uuid
      }
    }) : undefined;

    if (category?.uuid && !foundCategory) return errorResponse('Category not found');

    const tag = await this.prisma.tag.update({
      where: { id: foundTag.id },
      data: {
        title: title ? title : undefined,
        categoryId: foundCategory?.id
      },
      select: {
        id: true,
        uuid: true,
        title: true,
        value: true,
        category: {
          select: {
            id: true,
            uuid: true,
            title: true,
            value: true,
            type: true
          }
        }
      }
    });

    return tag;
  }

  async updateChild(dto: UpdateTagChildDto): Promise<any> {
    const {
      category,
      title,
      uuid,
      tagParent,
      level
    } = dto

    const foundTag = await this.prisma.tag.findFirst({
      where: { uuid }
    });

    if (!foundTag) return errorResponse('Tag not found');

    const foundCategory = category.uuid ? await this.prisma.category.findFirst({
      where: {
        uuid: category.uuid
      }
    }) : undefined;

    if (category?.uuid && !foundCategory) return errorResponse('Category not found');

    const foundTagParent = tagParent.uuid ? await this.prisma.tag.findFirst({
      where: { uuid: tagParent.uuid }
    }) : undefined;

    if (tagParent?.uuid && !foundTagParent) return errorResponse('Tag parent not found');

    const tag = await this.prisma.tag.update({
      where: { id: foundTag.id },
      data: {
        title: title ? title : undefined,
        categoryId: foundCategory?.id,
        parentId: foundTagParent?.id,
        level: level ? level : undefined
      },
      select: {
        id: true,
        uuid: true,
        title: true,
        value: true,
        parent: foundTagParent ? {
          select: {
            id: true,
            uuid: true,
            title: true,
            value: true
          }
        } : undefined,
        category: foundCategory ? {
          select: {
            id: true,
            uuid: true,
            title: true,
            value: true,
            type: true
          }
        } : undefined
      }
    });

    return tag;
  }
}