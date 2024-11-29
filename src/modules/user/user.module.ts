import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { UserService } from './user.service';
import { PrismaService } from '@/config/prisma.config';

@Module({
  imports: [RoleModule],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [],
})
export class UserModule {}
