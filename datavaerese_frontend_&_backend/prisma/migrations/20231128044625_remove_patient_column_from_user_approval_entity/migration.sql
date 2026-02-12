/*
  Warnings:

  - You are about to drop the column `patientId` on the `UserApproval` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserApproval" DROP CONSTRAINT "UserApproval_patientId_fkey";

-- AlterTable
ALTER TABLE "UserApproval" DROP COLUMN "patientId";
