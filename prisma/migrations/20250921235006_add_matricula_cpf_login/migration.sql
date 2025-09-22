/*
  Warnings:

  - A unique constraint covering the columns `[matricula]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "usuarios_email_key";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "matricula" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_matricula_key" ON "usuarios"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");
