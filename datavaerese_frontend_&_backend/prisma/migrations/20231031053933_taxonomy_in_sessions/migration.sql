/*
  Warnings:

  - You are about to drop the `TypesInCESessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypesInDLSessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TypesInCESessions" DROP CONSTRAINT "TypesInCESessions_cESessionId_fkey";

-- DropForeignKey
ALTER TABLE "TypesInCESessions" DROP CONSTRAINT "TypesInCESessions_typesInTaxonomyId_fkey";

-- DropForeignKey
ALTER TABLE "TypesInDLSessions" DROP CONSTRAINT "TypesInDLSessions_dLSessionId_fkey";

-- DropForeignKey
ALTER TABLE "TypesInDLSessions" DROP CONSTRAINT "TypesInDLSessions_typesInTaxonomyId_fkey";

-- DropTable
DROP TABLE "TypesInCESessions";

-- DropTable
DROP TABLE "TypesInDLSessions";

-- CreateTable
CREATE TABLE "TaxonomyInDLSessions" (
    "id" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,
    "taxonomyId" TEXT NOT NULL,

    CONSTRAINT "TaxonomyInDLSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxonomyInCESessions" (
    "id" TEXT NOT NULL,
    "cESessionId" TEXT NOT NULL,
    "taxonomyId" TEXT NOT NULL,

    CONSTRAINT "TaxonomyInCESessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaxonomyInDLSessions" ADD CONSTRAINT "TaxonomyInDLSessions_dLSessionId_fkey" FOREIGN KEY ("dLSessionId") REFERENCES "DLSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomyInDLSessions" ADD CONSTRAINT "TaxonomyInDLSessions_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "Taxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomyInCESessions" ADD CONSTRAINT "TaxonomyInCESessions_cESessionId_fkey" FOREIGN KEY ("cESessionId") REFERENCES "CESession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomyInCESessions" ADD CONSTRAINT "TaxonomyInCESessions_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "Taxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
