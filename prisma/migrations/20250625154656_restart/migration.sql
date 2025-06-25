/*
  Warnings:

  - Added the required column `disciplinaId` to the `perguntas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perguntas" ADD COLUMN     "disciplinaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "disciplinas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disciplinas_nome_key" ON "disciplinas"("nome");

-- AddForeignKey
ALTER TABLE "perguntas" ADD CONSTRAINT "perguntas_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
