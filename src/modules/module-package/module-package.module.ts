import { Module } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.config';
import { ModulePackageService } from './module-package.service';
import { ModulePackageController } from './module-package.controller';

@Module({
  providers: [ModulePackageService, PrismaService],
  controllers: [ModulePackageController]
})
export class ModulePackageModule { }
