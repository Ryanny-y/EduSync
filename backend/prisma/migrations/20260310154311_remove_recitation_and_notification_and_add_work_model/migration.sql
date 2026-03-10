/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationRecipient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `lessonId` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `workId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "NotificationRecipient_notificationId_userId_key";

-- DropIndex
DROP INDEX "Recitation_studentId_classId_question_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Notification";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NotificationRecipient";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Recitation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "dueDate" DATETIME,
    "classId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Work_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkMaterial_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkMaterial_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "gmeetLink" TEXT,
    "code" TEXT NOT NULL,
    "bgColor" TEXT,
    "teacherId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("bgColor", "code", "createdAt", "gmeetLink", "id", "name", "room", "section", "subject", "teacherId", "time", "updatedAt") SELECT "bgColor", "code", "createdAt", "gmeetLink", "id", "name", "room", "section", "subject", "teacherId", "time", "updatedAt" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "workId" TEXT NOT NULL,
    "grade" REAL,
    "feedBack" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("createdAt", "id", "studentId") SELECT "createdAt", "id", "studentId" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE UNIQUE INDEX "Submission_studentId_workId_key" ON "Submission"("studentId", "workId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
