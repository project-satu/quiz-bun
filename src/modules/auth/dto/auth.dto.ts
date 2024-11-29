import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsObject, IsString, MinLength } from 'class-validator';

export class RoleUuidDto {
  @ApiProperty()
  @IsString()
  uuid: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsObject()
  role: RoleUuidDto;
}
