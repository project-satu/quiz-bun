import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { PrismaService } from '@/config/prisma.config';

@Module({
  providers: [CityService, PrismaService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
