-- CreateTable
CREATE TABLE "TimeSpentInDLSessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeSpentInDLSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSpentInExtractedResources" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "extractedResourceId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeSpentInExtractedResources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeSpentInDLSessions" ADD CONSTRAINT "TimeSpentInDLSessions_dLSessionId_fkey" FOREIGN KEY ("dLSessionId") REFERENCES "DLSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSpentInExtractedResources" ADD CONSTRAINT "TimeSpentInExtractedResources_extractedResourceId_fkey" FOREIGN KEY ("extractedResourceId") REFERENCES "ExtractedResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
