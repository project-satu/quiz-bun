import { CategoryUuidDto } from "@/modules/category/dto/category.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString } from "class-validator";

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

  @ApiProperty({ type: [CategoryUuidDto] })
  @IsArray()
  categories: CategoryUuidDto[]
}

export class ModulePackageUuidDto {
  @ApiProperty()
  @IsString()
  uuid: string;
}

export class UpdateModulePackageDto extends CreateModulePackageDto {
  @ApiProperty()
  @IsString()
  uuid: string;
}