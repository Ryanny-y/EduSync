/*
  Warnings:

  - You are about to drop the column `status` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "FileType" ADD VALUE 'IMAGE';

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "status",
ADD COLUMN     "gradedAt" TIMESTAMP(3),
ADD COLUMN     "turnedInAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "SubmissionStatus";
