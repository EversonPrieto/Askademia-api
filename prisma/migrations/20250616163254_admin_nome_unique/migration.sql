/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `admins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admins_nome_key" ON "admins"("nome");
