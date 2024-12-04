import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { PrismaService } from '@/config/prisma.config';
import { CityModule } from '../city/city.module';

@Module({
  imports: [CityModule],
  controllers: [AddressController],
  providers: [PrismaService, AddressService],
  exports: [AddressService],
})
export class AddressModule {}
