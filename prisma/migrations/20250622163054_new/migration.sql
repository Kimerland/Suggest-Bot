-- CreateTable
CREATE TABLE "ReplySession" (
    "id" SERIAL NOT NULL,
    "adminId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReplySession_pkey" PRIMARY KEY ("id")
);
