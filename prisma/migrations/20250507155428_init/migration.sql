-- CreateTable
CREATE TABLE "usuarios" (
    "id" VARCHAR(36) NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "senha" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
