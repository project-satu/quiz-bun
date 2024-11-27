import { ModulePackageUuidDto } from "@/modules/module-package/dto/module-package.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsObject, IsString } from "class-validator";

export class CreateQuestionExplanationDto {
  @ApiProperty()
  @IsString()
  explanationText?: string

  @ApiProperty()
  @IsString()
  explanationImage?: string
}

export class CreateQuestionOptionDto {
  @ApiProperty()
  @IsString()
  optionText?: string;

  @ApiProperty()
  @IsString()
  optionImage?: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect?: boolean
}

export class CreateQuestionDto {
  [x: string]: any;
  @ApiProperty()
  @IsString()
  questionText?: string

  @ApiProperty()
  @IsString()
  questionImage?: string

  @ApiProperty()
  @IsInt()
  points?: number

  @ApiProperty({ type: CreateQuestionOptionDto })
  @IsArray()
  questionOptions?: CreateQuestionOptionDto[]

  @ApiProperty()
  @IsObject()
  questionExplanation?: CreateQuestionExplanationDto
}

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

  @ApiProperty({ type: CreateQuestionDto })
  @IsArray()
  questions?: CreateQuestionDto[]
}

export class UpdateQuizDto extends CreateQuizDto {
  @ApiProperty()
  @IsString()
  uuid: string
}