import { CategoryUuidDto } from "@/modules/category/dto/category.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsObject, IsString, Min } from "class-validator";

export class CreteTagParentDto {
  @ApiProperty()
  @IsString()
  title?: string

  @ApiProperty()
  @IsString()
  value?: string

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  level?: number

  @ApiProperty()
  @IsObject()
  category?: CategoryUuidDto
}

export class TagUuidDto {
  @ApiProperty()
  @IsString()
  uuid?: string;
}

export class CreateTagChildDto extends CreteTagParentDto {
  @ApiProperty()
  @IsObject()
  tagParent?: TagUuidDto
}

export class UpdateTagParentDto {
  @ApiProperty()
  @IsString()
  uuid?: string

  @ApiProperty()
  @IsObject()
  category?: CategoryUuidDto

  @ApiProperty()
  @IsString()
  title?: string
}

export class UpdateTagChildDto extends UpdateTagParentDto {
  @ApiProperty()
  @IsString()
  uuid?: string

  @ApiProperty()
  @IsObject()
  tagParent?: TagUuidDto

  @ApiProperty()
  @IsInt()
  @Min(1)
  level?: number
}