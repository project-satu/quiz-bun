import { Filter } from "@/common/dto.common";
import { PrismaService } from "@/config/prisma.config";
import { paginationResponse, paramPaginate } from "@/utils/helpers/pagination.helper";
import { errorResponse } from "@/utils/helpers/response.helper";
import { Injectable } from "@nestjs/common";
import { UpdateTransactionStatusDto } from "./dto/transaction.dto";
import { TransactionStatusValue } from "@/constant/enum/transaction-status.enum";

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findAll(parmas: Filter) {
    const {
      page,
      per_page,
      skip,
      take
    } = paramPaginate(parmas);

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        skip,
        take,
        select: {
          id: true,
          uuid: true,
          purchaseAt: true,
          transactionId: true,
          status: {
            select: {
              id: true,
              uuid: true,
              title: true,
              value: true,
            },
          },
          packagePurchase: {
            select: {
              id: true,
              uuid: true,
              package: {
                select: {
                  id: true,
                  uuid: true,
                  title: true,
                },
              },
              user: {
                select: {
                  id: true,
                  uuid: true,
                  name: true,
                  email: true,
                },
              },
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),

      this.prisma.transaction.count(),
    ]);

    return paginationResponse(
      total,
      transactions,
      per_page,
      page,
      skip
    );
  }

  async updateStatus(dto: UpdateTransactionStatusDto) {
    const { uuid, status } = dto;

    const foundStatus = await this.prisma.transactionStatus.findFirst({
      where: {
        OR: [
          { value: status?.value },
          { uuid: status?.uuid },
        ],
      },
    });
    if (!foundStatus) return errorResponse('Status not found');

    const transaction = await this.prisma.transaction.findFirst({
      where: {
        uuid,
        status: { value: TransactionStatusValue.TRX_PENDING },
        NOT: { status: { id: foundStatus.id } },
      },
      select: { id: true, status: true, packagePurchase: { include: { package: true } } },
    });
    if (!transaction) return errorResponse('Transaction not found');

    if (foundStatus.value === transaction.status.value) {
      return errorResponse(`Status already updated: ${foundStatus.title}`);
    }

    let expirationDate = null;
    let isActive = false;
    if (foundStatus.value === TransactionStatusValue.TRX_SUCCESS) {
      const currentDate = new Date();

      // update expiration date
      expirationDate = new Date(
        currentDate.setMonth(
          currentDate.getMonth() + transaction.packagePurchase.package.durationInMonth,
        ),
      );

      // update is active
      isActive = true;
    }

    return await this.prisma.$transaction(async (prisma) =>
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: { connect: { id: foundStatus.id } },
          purchaseAt: new Date(),
          packagePurchase: {
            update: {
              status: { connect: { id: foundStatus.id } },
              expiredAt: expirationDate,
              isActive,
            },
          },
        },
        select: {
          id: true,
          uuid: true,
          status: { select: { id: true, uuid: true, title: true } },
          packagePurchase: {
            select: {
              id: true,
              uuid: true,
              status: { select: { id: true, uuid: true, title: true } },
            },
          },
        },
      })
    );
  }

}