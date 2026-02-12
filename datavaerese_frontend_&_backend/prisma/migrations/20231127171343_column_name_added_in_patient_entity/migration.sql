-- AlterTable
ALTER TABLE "UserApproval" ADD COLUMN     "patientId" TEXT;

-- AddForeignKey
ALTER TABLE "UserApproval" ADD CONSTRAINT "UserApproval_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
