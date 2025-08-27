/*
  Warnings:

  - You are about to drop the `likes_perguntas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes_respostas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "likes_perguntas" DROP CONSTRAINT "likes_perguntas_perguntaId_fkey";

-- DropForeignKey
ALTER TABLE "likes_perguntas" DROP CONSTRAINT "likes_perguntas_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "likes_respostas" DROP CONSTRAINT "likes_respostas_respostaId_fkey";

-- DropForeignKey
ALTER TABLE "likes_respostas" DROP CONSTRAINT "likes_respostas_usuarioId_fkey";

-- DropTable
DROP TABLE "likes_perguntas";

-- DropTable
DROP TABLE "likes_respostas";

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "respostaId" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_usuarioId_respostaId_key" ON "likes"("usuarioId", "respostaId");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_respostaId_fkey" FOREIGN KEY ("respostaId") REFERENCES "respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
