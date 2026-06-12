/*
  Warnings:

  - You are about to drop the column `coverMediaId` on the `Story` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_coverMediaId_fkey";

-- DropIndex
DROP INDEX "Story_coverMediaId_key";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "coverMediaId",
ALTER COLUMN "slug" DROP NOT NULL;
