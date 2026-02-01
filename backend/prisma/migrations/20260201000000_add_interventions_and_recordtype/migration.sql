-- AlterTable
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "recordType" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Intervention" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actionId" TEXT,
    "actionName" TEXT,
    "projectId" TEXT,
    "projectName" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "phase" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Intervention_planId_fkey'
  ) THEN
    ALTER TABLE "Intervention"
      ADD CONSTRAINT "Intervention_planId_fkey"
      FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
