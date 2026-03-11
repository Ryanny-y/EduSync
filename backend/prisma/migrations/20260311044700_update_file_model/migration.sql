/*
  Warnings:

  - You are about to drop the column `path` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[driveFileId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `driveFileId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webContentLink` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webViewLink` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "path",
ADD COLUMN     "driveFileId" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "webContentLink" TEXT NOT NULL,
ADD COLUMN     "webViewLink" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_driveFileId_key" ON "File"("driveFileId");
