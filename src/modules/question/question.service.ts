import { UuidDto } from "@/common/dto.common";
import { PrismaService } from "@/config/prisma.config";
import { isAdmin, isTeacher } from "@/utils/validation-role.util";
import { Injectable } from "@nestjs/common";

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

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
}