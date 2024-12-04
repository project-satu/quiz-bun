import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';
import { CreateQuizDto, UpdateQuizDto } from './dto/quiz.dto';
import { Filter, UuidDto } from '@/common/dto.common';
import { errorResponse } from '@/utils/helpers/response.helper';
import {
  paginationResponse,
  paramPaginate,
} from '@/utils/helpers/pagination.helper';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

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
                isCorrect: true,
              },
            },
            explanation: {
              select: {
                explanationText: true,
                explanationImage: true,
              },
            },
          },
        },
      },
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
                  isCorrect: true,
                },
              },
              explanation: {
                select: {
                  explanationText: true,
                  explanationImage: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.quiz.count(),
    ]);

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

  async findOne(quizDto: UuidDto, params: Filter): Promise<any> {
    const pagination = paramPaginate(params);

    const quiz = await this.prisma.quiz.findFirst({
      where: { uuid: quizDto.uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
        description: true,
      },
    });

    if (!quiz) return errorResponse('Quiz not found');

    const [questions, total] = await this.prisma.$transaction([
      this.prisma.question.findMany({
        where: { quizId: quiz.id },
        skip: pagination.skip,
        take: pagination.take,
        select: {
          questionText: true,
          questionImage: true,
          points: true,
          options: {
            select: {
              optionText: true,
              optionImage: true,
              isCorrect: true,
            },
          },
          explanation: {
            select: {
              explanationText: true,
              explanationImage: true,
            },
          },
        },
      }),

      this.prisma.question.count({
        where: { quizId: quiz.id },
      }),
    ]);

    const newData = {
      ...quiz,
      questions,
    };

    return paginationResponse(
      total,
      newData,
      pagination.per_page,
      pagination.page,
      pagination.skip,
    );
  }

  async create(quizDto: CreateQuizDto): Promise<any> {
    const { title, description, modulePackage, questions } = quizDto;

    const module = await this.prisma.modulePackage.findFirst({
      where: { uuid: modulePackage.uuid },
    });

    if (!module) return errorResponse('Module package not found');

    const quiz = await this.prisma.quiz.create({
      data: {
        title,
        description,
        moduleId: module.id,
        questions: {
          create: questions.map((question) => ({
            questionText: question.questionText,
            questionImage: question.questionImage,
            points: question.points,
            options: {
              create: question.questionOptions.map(
                (option: {
                  optionText: string;
                  optionImage: string;
                  isCorrect: boolean;
                }) => ({
                  optionText: option.optionText,
                  optionImage: option.optionImage,
                  isCorrect: option.isCorrect,
                }),
              ),
            },
            explanation: {
              create: {
                explanationText: question.questionExplanation.explanationText,
                explanationImage: question.questionExplanation.explanationImage,
              },
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
            explanation: true,
          },
        },
      },
    });

    return quiz;
  }

  async update(dto: UpdateQuizDto): Promise<any> {
    const { uuid, title, description, modulePackage, questions } = dto;

    const module = modulePackage?.uuid
      ? await this.prisma.modulePackage.findFirst({
          where: { uuid: modulePackage.uuid },
        })
      : undefined;

    if (modulePackage?.uuid && !module)
      return errorResponse('Module package not found');

    const quiz = await this.prisma.quiz.update({
      where: { uuid },
      data: {
        title,
        description,
        moduleId: module ? module?.id : undefined,
        questions: questions
          ? {
              create: questions
                ? questions?.map((question) => ({
                    data: {
                      questionText: question?.questionText
                        ? question?.questionText
                        : undefined,
                      questionImage: question?.questionImage
                        ? question?.questionImage
                        : undefined,
                      points: question?.points ? question?.points : undefined,
                      options: question?.questionOptions
                        ? {
                            deleteMany: {
                              id: {
                                in: quiz?.questions?.map(
                                  (question: { options: any[] }) =>
                                    question?.options?.map(
                                      (option) => option?.id,
                                    ),
                                ),
                              },
                            },
                            create: question?.questionOptions?.map(
                              (option: {
                                optionText: string;
                                optionImage: string;
                                isCorrect: boolean;
                              }) => ({
                                data: {
                                  optionText: option?.optionText,
                                  optionImage: option?.optionImage,
                                  isCorrect: option?.isCorrect,
                                },
                              }),
                            ),
                          }
                        : undefined,
                      explanation: question?.questionExplanation
                        ?.explanationText
                        ? {
                            delete: true,
                            create: {
                              explanationText:
                                question?.questionExplanation?.explanationText,
                              explanationImage:
                                question?.questionExplanation?.explanationImage,
                            },
                          }
                        : undefined,
                    },
                  }))
                : undefined,
            }
          : undefined,
      },
      include: {
        module: true,
        questions: {
          include: {
            options: true,
            explanation: true,
          },
        },
      },
    });

    return quiz;
  }
}
