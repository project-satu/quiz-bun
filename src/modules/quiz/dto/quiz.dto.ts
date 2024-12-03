import { ModulePackageUuidDto } from "@/modules/module-package/dto/module-package.dto";
import { CreateQuestionDto } from "@/modules/question/dto/question.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsString } from "class-validator";

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty({ type: ModulePackageUuidDto })
  @IsObject()
  modulePackage?: ModulePackageUuidDto;

  @ApiProperty({ type: [CreateQuestionDto] })
  @IsArray()
  questions: CreateQuestionDto[]
}

export class UpdateQuizDto extends CreateQuizDto {
  @ApiProperty()
  @IsString()
  uuid: string
}