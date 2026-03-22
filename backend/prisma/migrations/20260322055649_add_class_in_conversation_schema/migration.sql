/*
  Warnings:

  - Added the required column `classId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "classId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
