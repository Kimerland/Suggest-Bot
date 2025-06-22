/*
  Warnings:

  - Added the required column `messageId` to the `ReplySession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReplySession" ADD COLUMN     "messageId" INTEGER NOT NULL;
