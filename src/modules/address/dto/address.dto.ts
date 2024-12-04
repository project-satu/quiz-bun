import { UuidDto } from '@/common/dto.common';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsObject()
  city: UuidDto;

  @ApiProperty()
  @IsString()
  fullAddress: string;
}
