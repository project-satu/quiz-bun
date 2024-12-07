import { PrismaService } from "@/config/prisma.config";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService],
  exports: [TransactionService],
})

export class TransactionModule { }