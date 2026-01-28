-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "district" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "region" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "legacyId" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "district" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "data" JSONB;

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "legacyId" INTEGER;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "legacyId" INTEGER;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Plan" (
    "id" TEXT NOT NULL,
    "ownerKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "deadline" TEXT,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "executed" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PlanProject" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "projectLegacyId" TEXT,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignedAmount" DOUBLE PRECISION NOT NULL,
    "executedAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AnnualBudget" (
    "id" TEXT NOT NULL,
    "ownerKey" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnualBudget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Project_legacyId_key" ON "Project"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Asset_legacyId_key" ON "Asset"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Report_legacyId_key" ON "Report"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AnnualBudget_ownerKey_year_key" ON "AnnualBudget"("ownerKey", "year");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PlanProject_planId_fkey'
  ) THEN
    ALTER TABLE "PlanProject"
      ADD CONSTRAINT "PlanProject_planId_fkey"
      FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
