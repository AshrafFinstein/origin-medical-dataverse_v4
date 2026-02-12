/*
  Warnings:

  - You are about to drop the column `taxonomyTypeId` on the `TaxonomyDataInDLSessions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaxonomyDataInDLSessions" DROP CONSTRAINT "TaxonomyDataInDLSessions_taxonomyTypeId_fkey";

-- AlterTable
ALTER TABLE "TaxonomyDataInDLSessions" DROP COLUMN "taxonomyTypeId";
