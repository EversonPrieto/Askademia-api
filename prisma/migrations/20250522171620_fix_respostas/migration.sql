/*
  Warnings:

  - You are about to drop the column `conteudo` on the `respostas` table. All the data in the column will be lost.
  - Added the required column `descricao` to the `respostas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "respostas" DROP COLUMN "conteudo",
ADD COLUMN     "descricao" TEXT NOT NULL;
