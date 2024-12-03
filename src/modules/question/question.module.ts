import { Module } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.config';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

@Module({
  providers: [QuestionService, PrismaService],
  controllers: [QuestionController]
})
export class QuestionModule { }
