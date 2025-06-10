/*
  Warnings:

  - The values [NO_DEPOSIT,FREE_SPINS] on the enum `BonusType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `faviconUrl` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BonusType_new" AS ENUM ('WELCOME', 'RELOAD', 'CASHBACK', 'FREESPINS', 'NODEPOSIT', 'OTHER');
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
ALTER TABLE "Casino" ADD COLUMN     "featuredImage" TEXT;

-- AlterTable
ALTER TABLE "OfferTracking" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "bonusId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "faviconUrl",
ADD COLUMN     "favicon" TEXT;

-- AddForeignKey
ALTER TABLE "Bonus" ADD CONSTRAINT "Bonus_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTracking" ADD CONSTRAINT "OfferTracking_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "Bonus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
