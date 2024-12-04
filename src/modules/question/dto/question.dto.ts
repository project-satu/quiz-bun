import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsArray, IsObject } from "class-validator";
import { CreateQuestionOptionDto } from "../question-option/dto/question-option.dto";
import { CreateQuestionExplanationDto } from "../question-explanation/dto/question-explanation.dto";

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  questionText?: string

  @ApiProperty()
  @IsString()
  questionImage?: string

  @ApiProperty()
  @IsInt()
  points?: number

  @ApiProperty({ type: [CreateQuestionOptionDto] })
  @IsArray()
  questionOptions?: CreateQuestionOptionDto[]

  @ApiProperty()
  @IsObject()
  questionExplanation?: CreateQuestionExplanationDto
}

export class UpdateQuestionDto extends CreateQuestionDto {
  @ApiProperty({ required: true })
  @IsString()
  uuid: string
}