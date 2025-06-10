/*
  Warnings:

  - You are about to drop the column `bonusId` on the `OfferTracking` table. All the data in the column will be lost.
  - You are about to drop the column `casinoId` on the `OfferTracking` table. All the data in the column will be lost.
  - You are about to drop the column `casinoId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Bonus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Casino` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `whopId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromoType" AS ENUM ('DISCOUNT', 'FREE_TRIAL', 'EXCLUSIVE_ACCESS', 'BUNDLE_DEAL', 'LIMITED_TIME');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Bonus" DROP CONSTRAINT "Bonus_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "OfferTracking" DROP CONSTRAINT "OfferTracking_bonusId_fkey";

-- DropForeignKey
ALTER TABLE "OfferTracking" DROP CONSTRAINT "OfferTracking_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_casinoId_fkey";

-- AlterTable
ALTER TABLE "OfferTracking" DROP COLUMN "bonusId",
DROP COLUMN "casinoId",
ADD COLUMN     "promoCodeId" TEXT,
ADD COLUMN     "whopId" TEXT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "casinoId",
ADD COLUMN     "whopId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Bonus";

-- DropTable
DROP TABLE "Casino";

-- DropEnum
DROP TYPE "BonusType";

-- CreateTable
CREATE TABLE "Whop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "affiliateLink" TEXT,
    "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "website" TEXT,
    "price" TEXT,
    "category" TEXT,
    "aboutContent" TEXT,
    "howToRedeemContent" TEXT,
    "promoDetailsContent" TEXT,
    "featuresContent" TEXT,
    "termsContent" TEXT,
    "faqContent" TEXT,

    CONSTRAINT "Whop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT,
    "type" "PromoType" NOT NULL,
    "value" TEXT NOT NULL,
    "whopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkImport" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "successRows" INTEGER NOT NULL,
    "failedRows" INTEGER NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PROCESSING',
    "errors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulkImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Whop_slug_key" ON "Whop"("slug");

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_whopId_fkey" FOREIGN KEY ("whopId") REFERENCES "Whop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_whopId_fkey" FOREIGN KEY ("whopId") REFERENCES "Whop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_whopId_fkey" FOREIGN KEY ("whopId") REFERENCES "Whop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
