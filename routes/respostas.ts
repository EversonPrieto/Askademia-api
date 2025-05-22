import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { descricao, perguntaId, usuarioId } = req.body;

  try {
    const resposta = await prisma.resposta.create({
      data: { descricao, perguntaId, usuarioId },
    });
    res.status(201).json(resposta);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar resposta." });
  }
});

router.get("/", async (req, res) => {
  try {
    const respostas = await prisma.resposta.findMany({
      include: {
        usuario: true,
        pergunta: true,
      },
    });
    res.json(respostas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar respostas." });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const resposta = await prisma.resposta.findUnique({
      where: { id },
      include: {
        usuario: true,
        pergunta: true,
      },
    });

    if (!resposta) {
      res.status(404).json({ error: "Resposta não encontrada." });
    }

    res.json(resposta);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar resposta." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { descricao } = req.body;

  try {
    const resposta = await prisma.resposta.update({
      where: { id },
      data: { descricao },
    });
    res.json(resposta);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar resposta." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.resposta.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar resposta." });
  }
});

export default router;
