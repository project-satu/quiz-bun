import { PrismaService } from '@/config/prisma.config';
import { Injectable } from '@nestjs/common';
import { CreatePackagePurchaseDto } from './dto/package-purchase.dto';
import { ModulePackageService } from '../module-package/module-package.service';
import { errorResponse } from '@/utils/helpers/response.helper';
import { TransactionStatusValue } from '@/constant/enum/transaction-status.enum';
import { GenerateTrxId } from '@/utils/generateCode.util';

@Injectable()
export class PackagePurchaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly modulePackageService: ModulePackageService,
  ) {}

  async create(createPackageDto: CreatePackagePurchaseDto, user: any) {
    const { modulePackage } = createPackageDto;

    const foundModulePackage = await this.modulePackageService.findOne(
      modulePackage.uuid,
    );

    if (!foundModulePackage) return errorResponse('module package not found');

    const trxStatus = await this.prisma.transactionStatus.findFirst({
      where: {
        value: TransactionStatusValue.TRX_PENDING,
      },
    });

    if (!trxStatus) return errorResponse('transaction status not found');

    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.setMonth(
        currentDate.getMonth() + foundModulePackage.durationInMonth,
      ),
    );

    const packagePurchase = await this.prisma.packagePurchase.create({
      data: {
        userId: user.id,
        packageId: foundModulePackage?.id,
        isActive: false,
        expiredAt: expirationDate,
        transactions: {
          create: {
            amount: foundModulePackage.price,
            purchaseAt: null,
            statusId: trxStatus.id,
            transactionId: GenerateTrxId(user.id, foundModulePackage.id),
          },
        },
      },
    });

    return packagePurchase;
  }
}
