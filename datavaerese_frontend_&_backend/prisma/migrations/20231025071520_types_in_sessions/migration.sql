-- CreateTable
CREATE TABLE "TypesInDLSessions" (
    "id" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,
    "typesInTaxonomyId" TEXT NOT NULL,

    CONSTRAINT "TypesInDLSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypesInCESessions" (
    "id" TEXT NOT NULL,
    "cESessionId" TEXT NOT NULL,
    "typesInTaxonomyId" TEXT NOT NULL,

    CONSTRAINT "TypesInCESessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TypesInDLSessions" ADD CONSTRAINT "TypesInDLSessions_dLSessionId_fkey" FOREIGN KEY ("dLSessionId") REFERENCES "DLSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypesInDLSessions" ADD CONSTRAINT "TypesInDLSessions_typesInTaxonomyId_fkey" FOREIGN KEY ("typesInTaxonomyId") REFERENCES "TypesInTaxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypesInCESessions" ADD CONSTRAINT "TypesInCESessions_cESessionId_fkey" FOREIGN KEY ("cESessionId") REFERENCES "CESession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypesInCESessions" ADD CONSTRAINT "TypesInCESessions_typesInTaxonomyId_fkey" FOREIGN KEY ("typesInTaxonomyId") REFERENCES "TypesInTaxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
