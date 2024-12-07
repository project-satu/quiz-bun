import { PrismaService } from '@/config/prisma.config';
import { Injectable } from '@nestjs/common';
import { CreatePackagePurchaseDto } from './dto/package-purchase.dto';
import { ModulePackageService } from '../module-package/module-package.service';
import { errorResponse } from '@/utils/helpers/response.helper';
import { TransactionStatusValue } from '@/constant/enum/transaction-status.enum';
import { GenerateTrxId, GenerateUniqueAmount } from '@/utils/generateCode.util';
import { Filter } from '@/common/dto.common';
import { paginationResponse, paramPaginate } from '@/utils/helpers/pagination.helper';

@Injectable()
export class PackagePurchaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly modulePackageService: ModulePackageService,
  ) { }

  async findAll(params: Filter) {
    const {
      page,
      per_page,
      skip,
      take
    } = paramPaginate(params);

    const [packagePurchases, total] = await this.prisma.$transaction([
      this.prisma.packagePurchase.findMany({
        skip,
        take,
        select: {
          id: true,
          uuid: true,
          isActive: true,
          expiredAt: true,
          package: {
            select: {
              id: true,
              uuid: true,
              title: true,
              description: true,
              price: true,
              durationInMonth: true,
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
          status: {
            select: {
              id: true,
              uuid: true,
              title: true,
              value: true,
            },
          }
        },
      }),

      this.prisma.packagePurchase.count()
    ]);

    return paginationResponse(
      total,
      packagePurchases,
      per_page,
      page,
      skip
    );
  }

  async create(createPackageDto: CreatePackagePurchaseDto, user: any) {
    const { modulePackage } = createPackageDto;

    const foundModulePackage = await this.modulePackageService.findOne(
      modulePackage.uuid,
    );
    if (!foundModulePackage) {
      return errorResponse('Module package not found');
    }


    const trxStatus = await this.prisma.transactionStatus.findFirst({
      where: {
        value: TransactionStatusValue.TRX_PENDING,
      },
    });
    if (!trxStatus) {
      return errorResponse('Transaction status not found', 403);
    }

    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.setMonth(
        currentDate.getMonth() + foundModulePackage.durationInMonth,
      ),
    );

    const checkPurchasePending = await this.prisma.packagePurchase.findFirst({
      where: {
        userId: user.id,
        packageId: foundModulePackage.id,
        status: {
          value: {
            in: [TransactionStatusValue.TRX_PENDING],
          },
        },
        transactions: {
          some: {
            status: {
              value: {
                in: [TransactionStatusValue.TRX_PENDING],
              },
            },
          },
        },
      },
    });

    if (checkPurchasePending) {
      return errorResponse(
        `${foundModulePackage.title} is still waiting for payment.`,
        403,
      );
    }

    const uniqueCode = GenerateUniqueAmount(foundModulePackage.price);
    // Start a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const packagePurchase = await prisma.packagePurchase.create({
        data: {
          userId: user.id,
          packageId: foundModulePackage.id,
          isActive: false,
          expiredAt: expirationDate,
          statusId: trxStatus.id,
          transactions: {
            create: {
              amount: foundModulePackage.price + uniqueCode,
              purchaseAt: null,
              statusId: trxStatus.id,
              transactionId: GenerateTrxId(user.id, foundModulePackage.id),
            },
          },
        },
        select: {
          id: true,
          uuid: true,
          isActive: true,
          expiredAt: true,
          status: {
            select: {
              id: true,
              uuid: true,
              title: true,
              value: true,
            },
          },
          package: {
            select: {
              id: true,
              uuid: true,
              title: true,
              description: true,
              price: true,
              durationInMonth: true,
            },
          },
          transactions: {
            select: {
              id: true,
              uuid: true,
              amount: true,
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
        },
      });

      return packagePurchase;
    });

    return result;
  }

}
