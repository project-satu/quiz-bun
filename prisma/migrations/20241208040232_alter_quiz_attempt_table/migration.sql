/*
  Warnings:

  - Made the column `userId` on table `QuizAttempt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quizId` on table `QuizAttempt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `QuizAttempt` DROP FOREIGN KEY `QuizAttempt_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizAttempt` DROP FOREIGN KEY `QuizAttempt_userId_fkey`;

-- AlterTable
ALTER TABLE `QuizAttempt` MODIFY `completedAt` DATETIME(3) NULL,
    MODIFY `userId` INTEGER NOT NULL,
    MODIFY `quizId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
