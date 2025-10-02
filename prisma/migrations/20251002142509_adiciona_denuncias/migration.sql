-- CreateEnum
CREATE TYPE "MotivoDenuncia" AS ENUM ('SPAM', 'ODIO', 'IMPROPRIO', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusDenuncia" AS ENUM ('PENDENTE', 'RESOLVIDO');

-- CreateTable
CREATE TABLE "denuncias" (
    "id" SERIAL NOT NULL,
    "motivo" "MotivoDenuncia" NOT NULL,
    "justificativa" TEXT,
    "status" "StatusDenuncia" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "denuncianteId" INTEGER NOT NULL,
    "perguntaId" INTEGER,
    "respostaId" INTEGER,

    CONSTRAINT "denuncias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_denuncianteId_fkey" FOREIGN KEY ("denuncianteId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_respostaId_fkey" FOREIGN KEY ("respostaId") REFERENCES "respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
