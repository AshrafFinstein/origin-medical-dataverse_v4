/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CESession` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `DLSession` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Label` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,abbreviation]` on the table `Label` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `RASession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CESession_name_key" ON "CESession"("name" ASC);

-- CreateIndex
CREATE INDEX "CESession_projectId_idx" ON "CESession" USING HASH ("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "DLSession_name_key" ON "DLSession"("name" ASC);

-- CreateIndex
CREATE INDEX "DLSession_projectId_idx" ON "DLSession" USING HASH ("projectId");

-- CreateIndex
CREATE INDEX "ExtractedResource_rawResourceId_idx" ON "ExtractedResource" USING HASH ("rawResourceId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInCESessions_extractedResourceId_idx" ON "ExtractedResourcesInCESessions" USING HASH ("extractedResourceId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInCESessions_cESessionId_idx" ON "ExtractedResourcesInCESessions" USING HASH ("cESessionId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInDLSessions_extractedResourceId_idx" ON "ExtractedResourcesInDLSessions" USING HASH ("extractedResourceId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInDLSessions_dLSessionId_idx" ON "ExtractedResourcesInDLSessions" USING HASH ("dLSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_abbreviation_key" ON "Label"("name", "abbreviation");

-- CreateIndex
CREATE INDEX "LabelsInDLSessions_labelId_idx" ON "LabelsInDLSessions" USING HASH ("labelId");

-- CreateIndex
CREATE INDEX "LabelsInDLSessions_dLSessionId_idx" ON "LabelsInDLSessions" USING HASH ("dLSessionId");

-- CreateIndex
CREATE INDEX "LabelsInExtractedResourcesInDLSessions_extractedResourceId_idx" ON "LabelsInExtractedResourcesInDLSessions" USING HASH ("extractedResourceId");

-- CreateIndex
CREATE INDEX "LabelsInExtractedResourcesInDLSessions_dLSessionId_idx" ON "LabelsInExtractedResourcesInDLSessions" USING HASH ("dLSessionId");

-- CreateIndex
CREATE INDEX "LabelsInExtractedResourcesInDLSessions_labelId_idx" ON "LabelsInExtractedResourcesInDLSessions" USING HASH ("labelId");

-- CreateIndex
CREATE INDEX "Project_epicId_idx" ON "Project" USING HASH ("epicId");

-- CreateIndex
CREATE UNIQUE INDEX "RASession_name_key" ON "RASession"("name" ASC);

-- CreateIndex
CREATE INDEX "RASession_projectId_idx" ON "RASession" USING HASH ("projectId");

-- CreateIndex
CREATE INDEX "RawResource_visitId_idx" ON "RawResource" USING HASH ("visitId");

-- CreateIndex
CREATE INDEX "Visit_patientId_idx" ON "Visit" USING HASH ("patientId");

-- CreateIndex
CREATE INDEX "VisitsInRASessions_rASessionId_idx" ON "VisitsInRASessions" USING HASH ("rASessionId");

-- CreateIndex
CREATE INDEX "VisitsInRASessions_visitId_idx" ON "VisitsInRASessions" USING HASH ("visitId");
