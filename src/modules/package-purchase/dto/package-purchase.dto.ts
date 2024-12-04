import { UuidDto } from '@/common/dto.common';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class CreatePackagePurchaseDto {
  @ApiProperty()
  @IsObject()
  modulePackage: UuidDto;
}
