-- CreateTable
CREATE TABLE "TaxonomyDataInDLSessions" (
    "id" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,
    "extractedResourceId" TEXT NOT NULL,
    "taxonomyTypeId" TEXT NOT NULL,
    "taxonomyData" JSONB NOT NULL,

    CONSTRAINT "TaxonomyDataInDLSessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaxonomyDataInDLSessions" ADD CONSTRAINT "TaxonomyDataInDLSessions_dLSessionId_fkey" FOREIGN KEY ("dLSessionId") REFERENCES "DLSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomyDataInDLSessions" ADD CONSTRAINT "TaxonomyDataInDLSessions_extractedResourceId_fkey" FOREIGN KEY ("extractedResourceId") REFERENCES "ExtractedResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomyDataInDLSessions" ADD CONSTRAINT "TaxonomyDataInDLSessions_taxonomyTypeId_fkey" FOREIGN KEY ("taxonomyTypeId") REFERENCES "TaxonomyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
