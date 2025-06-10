/*
  Warnings:

  - You are about to drop the column `timestamp` on the `OfferTracking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Casino" ADD COLUMN     "minimumDeposit" TEXT,
ADD COLUMN     "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wageringRequirement" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "OfferTracking" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
