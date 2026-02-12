-- CreateTable
CREATE TABLE "ApprovalMatrix" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "sessionTypeId" INTEGER,
    "toUserId" TEXT NOT NULL,
    "approvalLevel" INTEGER NOT NULL,
    "approvalGroup" INTEGER NOT NULL,
    "isParallel" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "ApprovalMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApproval" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "approvalModuleUniqueId" TEXT NOT NULL,
    "approvalLevel" INTEGER NOT NULL,
    "approvalUserId" TEXT NOT NULL,
    "approvalStatusId" TEXT,
    "isCurrApprover" BOOLEAN NOT NULL,
    "isNextApprover" BOOLEAN NOT NULL,
    "epicId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "UserApproval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserApproval" ADD CONSTRAINT "UserApproval_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApproval" ADD CONSTRAINT "UserApproval_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
