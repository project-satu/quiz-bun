import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Quiz } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.config';
import { CreateQuizDto } from './dto/quiz.dto';
import { v4 as uuidv4 } from 'uuid';
import { Filter } from '@/common/dto.common';

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService
  ) { }

  async findAll(): Promise<any> {
    return await this.prisma.quiz.findMany({
      select: {
        id: true,
        uuid: true,
        title: true,
        description: true,
        questions: {
          select: {
            questionText: true,
            questionImage: true,
            points: true,
            options: {
              select: {
                optionText: true,
                optionImage: true,
                isCorrect: true
              }
            },
            explanation: {
              select: {
                explanationText: true,
                explanationImage: true
              }
            }
          }
        }
      }
    });
  }

  async getQuizzes(params: Filter): Promise<any> {
    const page = Number(params.page) || 1;
    const per_page = Number(params.per_page) || 10;
    const skip = (page - 1) * per_page;

    const [quizzes, total] = await this.prisma.$transaction([
      this.prisma.quiz.findMany({
        skip,
        take: per_page,
        select: {
          id: true,
          uuid: true,
          title: true,
          description: true,
          questions: {
            select: {
              questionText: true,
              questionImage: true,
              points: true,
              options: {
                select: {
                  optionText: true,
                  optionImage: true,
                  isCorrect: true
                }
              },
              explanation: {
                select: {
                  explanationText: true,
                  explanationImage: true
                }
              }
            }
          }
        }
      }),
      this.prisma.quiz.count()
    ])
    console.log(quizzes, total);
    const last_page = Math.ceil(total / per_page);
    const from = skip + 1;
    const to = Math.min(skip + per_page, total);

    return {
      items: quizzes,
      meta: {
        pagination: {
          total,
          per_page,
          current_page: page,
          last_page,
          from,
          to,
        },
      },
    };
  }

  async findOne(uuid: string): Promise<any> {
    return await this.prisma.quiz.findFirst({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
        description: true,
        questions: {
          select: {
            questionText: true,
            questionImage: true,
            points: true,
            options: {
              select: {
                optionText: true,
                optionImage: true,
                isCorrect: true
              }
            },
            explanation: {
              select: {
                explanationText: true,
                explanationImage: true
              }
            }
          }
        }
      }
    });
  }

  async create(quizDto: CreateQuizDto): Promise<any> {
    const {
      title,
      description,
      questions
    } = quizDto;

    const quiz = await this.prisma.quiz.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map(question => ({
            uuid: uuidv4(),
            questionText: question.questionText,
            questionImage: question.questionImage,
            points: question.points,
            options: {
              create: question.questionOptions.map((option: { optionText: string; optionImage: string; isCorrect: boolean }) => ({
                uuid: uuidv4(),
                optionText: option.optionText,
                optionImage: option.optionImage,
                isCorrect: option.isCorrect
              }))
            },
            explanation: {
              create: {
                uuid: uuidv4(),
                explanationText: question.questionExplanation.explanationText,
                explanationImage: question.questionExplanation.explanationImage
              }
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true,
            explanation: true
          }
        }
      }
    });

    return quiz;
  }
}
