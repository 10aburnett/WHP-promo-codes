/*
  Warnings:

  - The values [FREESPINS,NODEPOSIT,OTHER] on the enum `BonusType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `ipAddress` on the `OfferTracking` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `OfferTracking` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `OfferTracking` table. All the data in the column will be lost.
  - You are about to drop the column `favicon` on the `Settings` table. All the data in the column will be lost.
  - Made the column `bonusId` on table `OfferTracking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BonusType_new" AS ENUM ('WELCOME', 'NO_DEPOSIT', 'FREE_SPINS', 'RELOAD', 'CASHBACK');
ALTER TABLE "Bonus" ALTER COLUMN "type" TYPE "BonusType_new" USING ("type"::text::"BonusType_new");
ALTER TYPE "BonusType" RENAME TO "BonusType_old";
ALTER TYPE "BonusType_new" RENAME TO "BonusType";
DROP TYPE "BonusType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Bonus" DROP CONSTRAINT "Bonus_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "OfferTracking" DROP CONSTRAINT "OfferTracking_bonusId_fkey";

-- DropForeignKey
ALTER TABLE "OfferTracking" DROP CONSTRAINT "OfferTracking_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_casinoId_fkey";

-- AlterTable
ALTER TABLE "OfferTracking" DROP COLUMN "ipAddress",
DROP COLUMN "source",
DROP COLUMN "userAgent",
ALTER COLUMN "bonusId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "favicon",
ADD COLUMN     "faviconUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Bonus" ADD CONSTRAINT "Bonus_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "Bonus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
