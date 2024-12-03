import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateQuestionExplanationDto {
  @ApiProperty()
  @IsString()
  explanationText?: string

  @ApiProperty()
  @IsString()
  explanationImage?: string
}