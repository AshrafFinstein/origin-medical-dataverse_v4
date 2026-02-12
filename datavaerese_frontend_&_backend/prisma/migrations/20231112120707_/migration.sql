/*
  Warnings:

  - Added the required column `typesInTaxonomyId` to the `TaxonomyDataInDLSessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TaxonomyDataInDLSessions" DROP CONSTRAINT "TaxonomyDataInDLSessions_taxonomyTypeId_fkey";

-- AlterTable
ALTER TABLE "TaxonomyDataInDLSessions" ADD COLUMN     "typesInTaxonomyId" TEXT NOT NULL,
ALTER COLUMN "taxonomyTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TaxonomyDataInDLSessions" ADD CONSTRAINT "TaxonomyDataInDLSessions_typesInTaxonomyId_fkey" FOREIGN KEY ("typesInTaxonomyId") REFERENCES "TypesInTaxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomyDataInDLSessions" ADD CONSTRAINT "TaxonomyDataInDLSessions_taxonomyTypeId_fkey" FOREIGN KEY ("taxonomyTypeId") REFERENCES "TaxonomyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
