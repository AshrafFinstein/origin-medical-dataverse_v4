-- CreateEnum
CREATE TYPE "ProjectUserRole" AS ENUM ('NORMAL', 'LEAD_ANALYST', 'PROJECT_MASTER');

-- CreateEnum
CREATE TYPE "SessionUserRole" AS ENUM ('ACTIVITY', 'QUALITY_CONTROLLER');

-- CreateEnum
CREATE TYPE "ExtractedResourceStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'REJECTED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawResource" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL,
    "machine" TEXT NOT NULL,
    "center" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,

    CONSTRAINT "RawResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedResource" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL,
    "rawResourceId" TEXT NOT NULL,

    CONSTRAINT "ExtractedResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Epic" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,

    CONSTRAINT "Epic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "epicId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInProjects" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userRole" "ProjectUserRole" NOT NULL,

    CONSTRAINT "UsersInProjects_pkey" PRIMARY KEY ("userId","projectId","userRole")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "abbreviation" VARCHAR(100) NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DLSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "priority" INTEGER NOT NULL,
    "sop" TEXT[],
    "projectId" TEXT NOT NULL,

    CONSTRAINT "DLSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInDLSessions" (
    "userId" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,
    "userRole" "SessionUserRole" NOT NULL,

    CONSTRAINT "UsersInDLSessions_pkey" PRIMARY KEY ("userId","dLSessionId","userRole")
);

-- CreateTable
CREATE TABLE "ExtractedResourcesInDLSessions" (
    "extractedResourceId" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,
    "status" "ExtractedResourceStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ExtractedResourcesInDLSessions_pkey" PRIMARY KEY ("extractedResourceId","dLSessionId")
);

-- CreateTable
CREATE TABLE "LabelsInDLSessions" (
    "labelId" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,

    CONSTRAINT "LabelsInDLSessions_pkey" PRIMARY KEY ("labelId","dLSessionId")
);

-- CreateTable
CREATE TABLE "LabelsInExtractedResourcesInDLSessions" (
    "labelId" TEXT NOT NULL,
    "extractedResourceId" TEXT NOT NULL,
    "dLSessionId" TEXT NOT NULL,

    CONSTRAINT "LabelsInExtractedResourcesInDLSessions_pkey" PRIMARY KEY ("labelId","extractedResourceId","dLSessionId")
);

-- CreateTable
CREATE TABLE "CESession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "priority" INTEGER NOT NULL,
    "sop" TEXT[],
    "resultTemplate" JSONB NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "CESession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedResourcesInCESessions" (
    "extractedResourceId" TEXT NOT NULL,
    "cESessionId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "status" "ExtractedResourceStatus" NOT NULL DEFAULT 'PENDING',
    "result" JSONB NOT NULL,

    CONSTRAINT "ExtractedResourcesInCESessions_pkey" PRIMARY KEY ("extractedResourceId","cESessionId")
);

-- CreateTable
CREATE TABLE "UsersInCESessions" (
    "userId" TEXT NOT NULL,
    "cESessionId" TEXT NOT NULL,
    "userRole" "SessionUserRole" NOT NULL,

    CONSTRAINT "UsersInCESessions_pkey" PRIMARY KEY ("userId","cESessionId","userRole")
);

-- CreateTable
CREATE TABLE "RASession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "priority" INTEGER NOT NULL,
    "sop" TEXT[],
    "template" JSONB NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "RASession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitsInRASessions" (
    "visitId" TEXT NOT NULL,
    "rASessionId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "status" "ExtractedResourceStatus" NOT NULL DEFAULT 'PENDING',
    "result" JSONB NOT NULL,

    CONSTRAINT "VisitsInRASessions_pkey" PRIMARY KEY ("visitId","rASessionId")
);

-- CreateTable
CREATE TABLE "UsersInRASessions" (
    "userId" TEXT NOT NULL,
    "rASessionId" TEXT NOT NULL,
    "userRole" "SessionUserRole" NOT NULL,

    CONSTRAINT "UsersInRASessions_pkey" PRIMARY KEY ("userId","rASessionId","userRole")
);

-- CreateIndex
CREATE UNIQUE INDEX "Epic_name_key" ON "Epic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExtractedResourcesInCESessions_cESessionId_index_key" ON "ExtractedResourcesInCESessions"("cESessionId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "VisitsInRASessions_rASessionId_index_key" ON "VisitsInRASessions"("rASessionId", "index");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawResource" ADD CONSTRAINT "RawResource_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedResource" ADD CONSTRAINT "ExtractedResource_rawResourceId_fkey" FOREIGN KEY ("rawResourceId") REFERENCES "RawResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInProjects" ADD CONSTRAINT "UsersInProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DLSession" ADD CONSTRAINT "DLSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInDLSessions" ADD CONSTRAINT "UsersInDLSessions_dLSessionId_fkey" FOREIGN KEY ("dLSessionId") REFERENCES "DLSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedResourcesInDLSessions" ADD CONSTRAINT "ExtractedResourcesInDLSessions_extractedResourceId_fkey" FOREIGN KEY ("extractedResourceId") REFERENCES "ExtractedResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedResourcesInDLSessions" ADD CONSTRAINT "ExtractedResourcesInDLSessions_dLSessionId_fkey" FOREIGN KEY ("dLSessionId") REFERENCES "DLSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabelsInDLSessions" ADD CONSTRAINT "LabelsInDLSessions_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabelsInDLSessions" ADD CONSTRAINT "LabelsInDLSessions_dLSessionId_fkey" FOREIGN KEY ("dLSessionId") REFERENCES "DLSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabelsInExtractedResourcesInDLSessions" ADD CONSTRAINT "LabelsInExtractedResourcesInDLSessions_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabelsInExtractedResourcesInDLSessions" ADD CONSTRAINT "LabelsInExtractedResourcesInDLSessions_extractedResourceId_fkey" FOREIGN KEY ("extractedResourceId", "dLSessionId") REFERENCES "ExtractedResourcesInDLSessions"("extractedResourceId", "dLSessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CESession" ADD CONSTRAINT "CESession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedResourcesInCESessions" ADD CONSTRAINT "ExtractedResourcesInCESessions_extractedResourceId_fkey" FOREIGN KEY ("extractedResourceId") REFERENCES "ExtractedResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedResourcesInCESessions" ADD CONSTRAINT "ExtractedResourcesInCESessions_cESessionId_fkey" FOREIGN KEY ("cESessionId") REFERENCES "CESession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInCESessions" ADD CONSTRAINT "UsersInCESessions_cESessionId_fkey" FOREIGN KEY ("cESessionId") REFERENCES "CESession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RASession" ADD CONSTRAINT "RASession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitsInRASessions" ADD CONSTRAINT "VisitsInRASessions_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitsInRASessions" ADD CONSTRAINT "VisitsInRASessions_rASessionId_fkey" FOREIGN KEY ("rASessionId") REFERENCES "RASession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInRASessions" ADD CONSTRAINT "UsersInRASessions_rASessionId_fkey" FOREIGN KEY ("rASessionId") REFERENCES "RASession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
