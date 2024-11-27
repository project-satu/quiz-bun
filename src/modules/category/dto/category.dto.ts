import { CategoryType } from "@/constant/enum/category-type.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({ enum: CategoryType })
  @IsEnum(CategoryType)
  type: CategoryType;
}

export class BulkCreateCategoryDto {
  @ApiProperty({ type: [CreateCategoryDto] })
  @IsArray()
  data: CreateCategoryDto[];
}

export class CategoryUuidDto {
  @ApiProperty()
  @IsString()
  uuid: string;
}