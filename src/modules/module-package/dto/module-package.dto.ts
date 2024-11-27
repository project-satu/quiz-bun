import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateModulePackageDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsInt()
  durationInMonth: number;
}