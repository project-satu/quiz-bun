import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

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

export class StudentRegisterDto extends LoginDto {
  @ApiProperty({ minLength: 3, required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  phone: string;
}

export class RegisterDto extends StudentRegisterDto {
  @ApiProperty()
  @IsObject()
  @IsOptional()
  role?: RoleUuidDto;
}
