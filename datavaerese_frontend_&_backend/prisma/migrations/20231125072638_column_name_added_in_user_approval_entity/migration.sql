/*
  Warnings:

  - Added the required column `isReSubmitApprover` to the `UserApproval` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserApproval" ADD COLUMN     "isReSubmitApprover" BOOLEAN NOT NULL;
