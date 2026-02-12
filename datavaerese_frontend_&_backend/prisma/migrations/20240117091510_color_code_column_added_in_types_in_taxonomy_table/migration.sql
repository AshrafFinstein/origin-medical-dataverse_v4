/*
  Warnings:

  - Added the required column `updatedAt` to the `TaxonomyDataInDLSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedby` to the `TaxonomyDataInDLSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorCode` to the `TypesInTaxonomy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaxonomyDataInDLSessions" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedby" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaxonomyType" ADD COLUMN     "colorCode" TEXT;

-- AlterTable
ALTER TABLE "TypesInTaxonomy" ADD COLUMN     "colorCode" VARCHAR(300) NOT NULL;
