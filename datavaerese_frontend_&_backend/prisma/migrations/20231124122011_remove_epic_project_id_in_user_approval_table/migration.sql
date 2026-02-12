/*
  Warnings:

  - You are about to drop the column `epicId` on the `UserApproval` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `UserApproval` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserApproval" DROP CONSTRAINT "UserApproval_epicId_fkey";

-- DropForeignKey
ALTER TABLE "UserApproval" DROP CONSTRAINT "UserApproval_projectId_fkey";

-- AlterTable
ALTER TABLE "UserApproval" DROP COLUMN "epicId",
DROP COLUMN "projectId";
