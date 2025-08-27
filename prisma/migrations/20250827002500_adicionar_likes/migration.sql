-- CreateTable
CREATE TABLE "likes_perguntas" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,

    CONSTRAINT "likes_perguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes_respostas" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "respostaId" INTEGER NOT NULL,

    CONSTRAINT "likes_respostas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_perguntas_usuarioId_perguntaId_key" ON "likes_perguntas"("usuarioId", "perguntaId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_respostas_usuarioId_respostaId_key" ON "likes_respostas"("usuarioId", "respostaId");

-- AddForeignKey
ALTER TABLE "likes_perguntas" ADD CONSTRAINT "likes_perguntas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_perguntas" ADD CONSTRAINT "likes_perguntas_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_respostas" ADD CONSTRAINT "likes_respostas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_respostas" ADD CONSTRAINT "likes_respostas_respostaId_fkey" FOREIGN KEY ("respostaId") REFERENCES "respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
