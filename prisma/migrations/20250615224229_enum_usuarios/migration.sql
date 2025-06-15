-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ALUNO', 'MONITOR', 'PROFESSOR');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "tipo" "TipoUsuario" NOT NULL DEFAULT 'ALUNO';

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);
