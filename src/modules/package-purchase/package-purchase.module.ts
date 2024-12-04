import { Module } from '@nestjs/common';
import { PackagePurchaseService } from './package-purchase.service';
import { PackagePurchaseController } from './package-purchase.controller';
import { PrismaService } from '@/config/prisma.config';
import { ModulePackageModule } from '../module-package/module-package.module';

@Module({
  imports: [ModulePackageModule],
  providers: [PackagePurchaseService, PrismaService],
  controllers: [PackagePurchaseController],
  exports: [PackagePurchaseService],
})
export class PackagePurchaseModule {}
