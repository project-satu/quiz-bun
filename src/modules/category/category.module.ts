import { Module } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.config';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  providers: [CategoryService, PrismaService],
  controllers: [CategoryController]
})
export class CategoryModule { }
