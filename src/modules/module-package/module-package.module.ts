import { Module } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.config';
import { ModulePackageService } from './module-package.service';
import { ModulePackageController } from './module-package.controller';
import { PackagePurchaseService } from '../package-purchase/package-purchase.service';
import { MaterialService } from '../material/material.service';

@Module({
  providers: [ModulePackageService, PrismaService, PackagePurchaseService, MaterialService],
  controllers: [ModulePackageController],
  exports: [ModulePackageService],
})
export class ModulePackageModule { }
