import { Module } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.config';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';

@Module({
  providers: [MaterialService, PrismaService],
  controllers: [MaterialController]
})
export class MaterialModule { }
