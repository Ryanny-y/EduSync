/*
  Warnings:

  - You are about to drop the column `driveFileId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `webContentLink` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `webViewLink` on the `File` table. All the data in the column will be lost.
  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_driveFileId_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "driveFileId",
DROP COLUMN "mimeType",
DROP COLUMN "webContentLink",
DROP COLUMN "webViewLink",
ADD COLUMN     "bucket" TEXT,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "url" TEXT,
ADD COLUMN     "urlExpiresAt" TIMESTAMP(3);
