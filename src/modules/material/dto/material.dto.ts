import { CategoryUuidDto } from "@/modules/category/dto/category.dto";
import { ModulePackageUuidDto } from "@/modules/module-package/dto/module-package.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsString } from "class-validator";

export class CreateMaterialDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  materialText: string;

  @ApiProperty()
  @IsString()
  materialImage: string;

  @ApiProperty()
  @IsObject()
  modulePackage: ModulePackageUuidDto;

  @ApiProperty({ type: [CategoryUuidDto] })
  @IsArray()
  categories: CategoryUuidDto[];
}

export class UpdateMaterialDto extends CreateMaterialDto {
  @ApiProperty()
  @IsString()
  uuid: string;
}