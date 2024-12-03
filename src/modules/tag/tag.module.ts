import { Module } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.config';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { CategoryService } from '../category/category.service';

@Module({
  providers: [TagService, PrismaService, CategoryService],
  controllers: [TagController]
})
export class TagModule { }
