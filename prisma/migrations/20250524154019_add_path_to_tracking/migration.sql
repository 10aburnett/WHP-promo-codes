/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `Bonus` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `notificationPreferences` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCurrency` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBonus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserClaim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "OfferTracking" DROP CONSTRAINT "OfferTracking_bonusId_fkey";

-- DropForeignKey
ALTER TABLE "OfferTracking" DROP CONSTRAINT "OfferTracking_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBonus" DROP CONSTRAINT "UserBonus_bonusId_fkey";

-- DropForeignKey
ALTER TABLE "UserBonus" DROP CONSTRAINT "UserBonus_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserClaim" DROP CONSTRAINT "UserClaim_bonusId_fkey";

-- DropForeignKey
ALTER TABLE "UserClaim" DROP CONSTRAINT "UserClaim_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "UserClaim" DROP CONSTRAINT "UserClaim_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserReview" DROP CONSTRAINT "UserReview_userId_fkey";

-- AlterTable
ALTER TABLE "Bonus" DROP COLUMN "expiryDate";

-- AlterTable
ALTER TABLE "OfferTracking" ADD COLUMN     "path" TEXT,
ALTER COLUMN "casinoId" DROP NOT NULL,
ALTER COLUMN "bonusId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "image",
DROP COLUMN "notificationPreferences",
DROP COLUMN "preferredCurrency",
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "UserBonus";

-- DropTable
DROP TABLE "UserClaim";

-- DropTable
DROP TABLE "UserReview";

-- DropTable
DROP TABLE "VerificationToken";

-- DropEnum
DROP TYPE "ClaimStatus";

-- DropEnum
DROP TYPE "NotificationPreference";

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "Bonus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
