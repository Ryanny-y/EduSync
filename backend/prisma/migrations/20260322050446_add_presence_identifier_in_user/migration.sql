-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnline" BOOLEAN,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3);
