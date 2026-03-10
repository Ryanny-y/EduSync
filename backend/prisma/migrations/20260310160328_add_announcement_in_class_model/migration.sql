-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnnouncementFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "announcementId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnnouncementFile_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AnnouncementFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
