/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `ReplySession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReplySession_adminId_key" ON "ReplySession"("adminId");
