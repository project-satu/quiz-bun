import { UuidDto } from "@/common/dto.common";
import { PrismaService } from "@/config/prisma.config";
import { isAdmin, isTeacher } from "@/utils/validation-role.util";
import { Injectable } from "@nestjs/common";
import { UpdateQuestionDto } from "./dto/question.dto";
import { errorResponse } from "@/utils/helpers/response.helper";

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findOne(uuidDto: UuidDto) {
    const { uuid } = uuidDto;

    return this.prisma.question.findFirst({
      where: {
        uuid,
      },
    });
  }

  async getQuestion(questionDto: UuidDto, user: any) {
    const admin = isAdmin(user);
    const teacher = isTeacher(user);

    const question = await this.prisma.question.findFirst({
      where: { uuid: questionDto.uuid },
      select: {
        id: true,
        uuid: true,
        questionText: true,
        questionImage: true,
        points: true,
        options: {
          select: {
            id: true,
            uuid: true,
            optionText: true,
            optionImage: true,
            isCorrect: admin || teacher ? true : false,
          },
        },
      }
    });

    return question;
  }

  async getExplanation(questionDto: UuidDto) {
    const question = await this.prisma.question.findFirst({
      where: { uuid: questionDto.uuid },
      select: {
        id: true,
        uuid: true,
        explanation: {
          select: {
            id: true,
            uuid: true,
            explanationText: true,
            explanationImage: true,
          },
        },
      }
    });

    return question;
  }

  async updateQuestion(questionDto: UpdateQuestionDto) {
    const { uuid, points, questionExplanation, questionImage, questionOptions, questionText } = questionDto;

    const question = await this.findOne({ uuid });

    if (!question) return errorResponse('Question not found');

    await this.prisma.question.update({
      where: { id: question.id },
      data: {
        points: points ? points : undefined,
        questionText: questionText ? questionText : undefined,
        questionImage: questionImage ? questionImage : undefined,
        options: {
          create: questionOptions
            ? questionOptions?.map((item) => ({
              optionText: item?.optionText
                ? item?.optionText
                : undefined,
              optionImage: item?.optionImage
                ? item?.optionImage
                : undefined,
              isCorrect: item?.isCorrect
                ? item?.isCorrect
                : undefined,
            }))
            : undefined,
        },
        explanation: {
          create: questionExplanation
            ? {
              explanationText: questionExplanation?.explanationText
                ? questionExplanation?.explanationText
                : undefined,
              explanationImage: questionExplanation?.explanationImage
                ? questionExplanation?.explanationImage
                : undefined,
            }
            : undefined,
        },
      },
      include: {
        options: true,
        explanation: true,
      }
    });

    return question;
  }
} 