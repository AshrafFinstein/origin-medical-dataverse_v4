-- DropIndex
DROP INDEX "CESession_projectId_idx";

-- DropIndex
DROP INDEX "DLSession_projectId_idx";

-- DropIndex
DROP INDEX "ExtractedResource_rawResourceId_idx";

-- DropIndex
DROP INDEX "ExtractedResourcesInCESessions_cESessionId_idx";

-- DropIndex
DROP INDEX "ExtractedResourcesInCESessions_extractedResourceId_idx";

-- DropIndex
DROP INDEX "ExtractedResourcesInDLSessions_dLSessionId_idx";

-- DropIndex
DROP INDEX "ExtractedResourcesInDLSessions_extractedResourceId_idx";

-- DropIndex
DROP INDEX "LabelsInDLSessions_dLSessionId_idx";

-- DropIndex
DROP INDEX "LabelsInDLSessions_labelId_idx";

-- DropIndex
DROP INDEX "LabelsInExtractedResourcesInDLSessions_dLSessionId_idx";

-- DropIndex
DROP INDEX "LabelsInExtractedResourcesInDLSessions_extractedResourceId_idx";

-- DropIndex
DROP INDEX "LabelsInExtractedResourcesInDLSessions_labelId_idx";

-- DropIndex
DROP INDEX "Project_epicId_idx";

-- DropIndex
DROP INDEX "RASession_projectId_idx";

-- DropIndex
DROP INDEX "RawResource_visitId_idx";

-- DropIndex
DROP INDEX "Visit_patientId_idx";

-- DropIndex
DROP INDEX "VisitsInRASessions_rASessionId_idx";

-- DropIndex
DROP INDEX "VisitsInRASessions_visitId_idx";

-- CreateIndex
CREATE INDEX "CESession_projectId_idx" ON "CESession"("projectId");

-- CreateIndex
CREATE INDEX "DLSession_projectId_idx" ON "DLSession"("projectId");

-- CreateIndex
CREATE INDEX "ExtractedResource_rawResourceId_idx" ON "ExtractedResource"("rawResourceId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInCESessions_extractedResourceId_idx" ON "ExtractedResourcesInCESessions"("extractedResourceId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInCESessions_cESessionId_idx" ON "ExtractedResourcesInCESessions"("cESessionId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInDLSessions_extractedResourceId_idx" ON "ExtractedResourcesInDLSessions"("extractedResourceId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInDLSessions_dLSessionId_idx" ON "ExtractedResourcesInDLSessions"("dLSessionId");

-- CreateIndex
CREATE INDEX "ExtractedResourcesInDLSessions_status_idx" ON "ExtractedResourcesInDLSessions" USING HASH ("status");

-- CreateIndex
CREATE INDEX "LabelsInDLSessions_labelId_idx" ON "LabelsInDLSessions"("labelId");

-- CreateIndex
CREATE INDEX "LabelsInDLSessions_dLSessionId_idx" ON "LabelsInDLSessions"("dLSessionId");

-- CreateIndex
CREATE INDEX "LabelsInExtractedResourcesInDLSessions_extractedResourceId_idx" ON "LabelsInExtractedResourcesInDLSessions"("extractedResourceId");

-- CreateIndex
CREATE INDEX "LabelsInExtractedResourcesInDLSessions_dLSessionId_idx" ON "LabelsInExtractedResourcesInDLSessions"("dLSessionId");

-- CreateIndex
CREATE INDEX "LabelsInExtractedResourcesInDLSessions_labelId_idx" ON "LabelsInExtractedResourcesInDLSessions"("labelId");

-- CreateIndex
CREATE INDEX "Project_epicId_idx" ON "Project"("epicId");

-- CreateIndex
CREATE INDEX "RASession_projectId_idx" ON "RASession"("projectId");

-- CreateIndex
CREATE INDEX "RawResource_visitId_idx" ON "RawResource"("visitId");

-- CreateIndex
CREATE INDEX "Visit_patientId_idx" ON "Visit"("patientId");

-- CreateIndex
CREATE INDEX "VisitsInRASessions_rASessionId_idx" ON "VisitsInRASessions"("rASessionId");

-- CreateIndex
CREATE INDEX "VisitsInRASessions_visitId_idx" ON "VisitsInRASessions"("visitId");
