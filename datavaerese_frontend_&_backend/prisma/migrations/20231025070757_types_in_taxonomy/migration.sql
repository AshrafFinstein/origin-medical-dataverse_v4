-- CreateTable
CREATE TABLE "TypesInTaxonomy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taxonomyId" TEXT NOT NULL,
    "taxonomyTypeId" TEXT NOT NULL,

    CONSTRAINT "TypesInTaxonomy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TypesInTaxonomy" ADD CONSTRAINT "TypesInTaxonomy_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "Taxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypesInTaxonomy" ADD CONSTRAINT "TypesInTaxonomy_taxonomyTypeId_fkey" FOREIGN KEY ("taxonomyTypeId") REFERENCES "TaxonomyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
