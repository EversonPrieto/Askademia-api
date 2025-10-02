import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { motivo, justificativa, denuncianteId, perguntaId, respostaId } = req.body;

  if (!motivo || !denuncianteId || (!perguntaId && !respostaId)) {
     res.status(400).json({ error: "Dados insuficientes para criar a denúncia." });
     return;
  }

  try {
    const denuncia = await prisma.denuncia.create({
      data: {
        motivo,
        justificativa,
        denuncianteId: Number(denuncianteId),
        perguntaId: perguntaId ? Number(perguntaId) : undefined,
        respostaId: respostaId ? Number(respostaId) : undefined,
      },
    });
    res.status(201).json(denuncia);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar denúncia." });
  }
});

router.get("/", async (req, res) => {
  try {
    const denuncias = await prisma.denuncia.findMany({
      where: { status: 'PENDENTE' },
      orderBy: { createdAt: 'asc' },
      include: {
        denunciante: { select: { nome: true } },
        pergunta: { select: { id: true, titulo: true, disciplinaId: true } },
        resposta: { select: { id: true, descricao: true, pergunta: { select: { disciplinaId: true } } } },
      },
    });
    res.status(200).json(denuncias);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar denúncias." });
  }
});

router.put("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!status || (status !== 'PENDENTE' && status !== 'RESOLVIDO')) {
     res.status(400).json({ error: "Status inválido." });
     return;
  }

  try {
    const denuncia = await prisma.denuncia.update({
      where: { id },
      data: { status },
    });
    res.status(200).json(denuncia);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar status da denúncia." });
  }
});

export default router;