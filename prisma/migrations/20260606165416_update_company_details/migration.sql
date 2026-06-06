-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "description" TEXT,
ADD COLUMN     "employees" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "CompanyInterest" ADD COLUMN     "currentRound" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'registered';
