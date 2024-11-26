import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/quiz.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { successResponse, errorResponse } from '@/utils/helpers/response.helper';
import { Filter } from '@/common/dto.common';

// @ApiBearerAuth('access-token')
@Controller()
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
  ) { }

  @Get('quizzes')
  async findAll(@Query() params: Filter) {
    try {
      const data = await this.quizService.getQuizzes(params);

      return successResponse({ data, isPaginate: true });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @Post('quiz')
  async create(@Body() quizDto: CreateQuizDto) {
    try {
      const data = await this.quizService.create(quizDto);

      return successResponse({ data })
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }
}
