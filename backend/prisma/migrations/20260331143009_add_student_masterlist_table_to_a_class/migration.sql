-- CreateTable
CREATE TABLE "StudentMasterlist" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentMasterlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentMasterlist" ADD CONSTRAINT "StudentMasterlist_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
