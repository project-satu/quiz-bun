import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class Filter {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiProperty({ example: 10, description: 'Items per page', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  per_page?: number;
}
