-- CreateTable
CREATE TABLE "notificacoes" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "destinatarioId" INTEGER NOT NULL,
    "respostaId" INTEGER NOT NULL,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notificacoes_respostaId_key" ON "notificacoes"("respostaId");

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_respostaId_fkey" FOREIGN KEY ("respostaId") REFERENCES "respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
