import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { UuidDto } from "@/common/dto.common";
import { errorResponse, successResponse } from "@/utils/helpers/response.helper";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Request } from 'express';
import { UpdateQuestionDto } from "./dto/question.dto";

@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService
  ) { }

  @Get('question')
  async getQuestion(@Query() questionDto: UuidDto, @Req() req: Request) {
    try {
      const question = await this.questionService.getQuestion(questionDto, false);

      return successResponse({ data: question });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Get('moderator/question')
  async getQuestionForAdmin(@Query() questionDto: UuidDto, @Req() req: Request) {
    try {
      const question = await this.questionService.getQuestion(questionDto, req.user);

      return successResponse({ data: question });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Get('question/explanation')
  async getExplanation(@Query() questionDto: UuidDto) {
    try {
      const question = await this.questionService.getExplanation(questionDto);

      return successResponse({ data: question });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Put('moderator/question')
  async updateQuestion(@Body() questionDto: UpdateQuestionDto) {
    try {
      const question = await this.questionService.updateQuestion(questionDto);

      return successResponse({ data: question });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}