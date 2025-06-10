/*
  Warnings:

  - Made the column `affiliateLink` on table `Whop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Whop" ALTER COLUMN "affiliateLink" SET NOT NULL;
