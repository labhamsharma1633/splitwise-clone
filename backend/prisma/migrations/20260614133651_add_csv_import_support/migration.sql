-- AlterTable
ALTER TABLE "GroupMember" ADD COLUMN     "leftAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ImportSession" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportReport" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "issue" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportReport_sessionId_idx" ON "ImportReport"("sessionId");

-- AddForeignKey
ALTER TABLE "ImportReport" ADD CONSTRAINT "ImportReport_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ImportSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
