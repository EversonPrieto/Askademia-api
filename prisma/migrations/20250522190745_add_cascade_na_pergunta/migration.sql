-- DropForeignKey
ALTER TABLE "respostas" DROP CONSTRAINT "respostas_perguntaId_fkey";

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
