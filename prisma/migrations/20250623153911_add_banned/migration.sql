/*
  Warnings:

  - You are about to drop the `Ban` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Ban";

-- CreateTable
CREATE TABLE "BannedUser" (
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannedUser_pkey" PRIMARY KEY ("userId")
);
