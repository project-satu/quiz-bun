import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { UserService } from './user.service';
import { PrismaService } from '@/config/prisma.config';
import { UserController } from './user.controller';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [RoleModule, AddressModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
