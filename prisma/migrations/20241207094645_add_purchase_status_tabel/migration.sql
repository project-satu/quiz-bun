-- AlterTable
ALTER TABLE `PackagePurchase` ADD COLUMN `statusId` INTEGER NULL;

-- CreateTable
CREATE TABLE `PurchaseStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PurchaseStatus_uuid_key`(`uuid`),
    UNIQUE INDEX `PurchaseStatus_value_key`(`value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PackagePurchase` ADD CONSTRAINT `PackagePurchase_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `PurchaseStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
