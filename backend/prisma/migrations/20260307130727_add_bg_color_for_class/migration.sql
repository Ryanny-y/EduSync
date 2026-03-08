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
    "bgColor" TEXT NOT NULL DEFAULT '#90CF8E',
    "teacherId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("code", "createdAt", "gmeetLink", "id", "name", "room", "section", "subject", "teacherId", "time", "updatedAt") SELECT "code", "createdAt", "gmeetLink", "id", "name", "room", "section", "subject", "teacherId", "time", "updatedAt" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
