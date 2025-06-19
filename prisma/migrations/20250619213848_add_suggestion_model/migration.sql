/*
  Warnings:

  - You are about to drop the column `message` on the `Suggestion` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `Suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `Suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suggestion" DROP COLUMN "message",
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "messageId" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
