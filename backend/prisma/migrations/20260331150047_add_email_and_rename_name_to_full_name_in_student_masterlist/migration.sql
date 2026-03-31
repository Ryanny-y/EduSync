/*
  Warnings:

  - You are about to drop the column `name` on the `StudentMasterlist` table. All the data in the column will be lost.
  - Added the required column `email` to the `StudentMasterlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `StudentMasterlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentMasterlist" DROP COLUMN "name",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL;
