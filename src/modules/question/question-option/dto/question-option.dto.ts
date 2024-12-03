import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean } from "class-validator";

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