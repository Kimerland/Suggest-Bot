/*
  Warnings:

  - Added the required column `username` to the `BannedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BannedUser" ADD COLUMN     "username" TEXT NOT NULL;
