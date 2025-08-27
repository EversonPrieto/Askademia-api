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

router.post("/:respostaId/like", async (req, res) => {
  const respostaId = Number(req.params.respostaId);
  const { usuarioId } = req.body;

  if (!usuarioId) {
    res.status(400).json({ error: "O ID do usuário é obrigatório." });
    return;
  }

  try {
    const newLike = await prisma.like.create({
      data: {
        respostaId,
        usuarioId,
      },
    });
    res.status(201).json(newLike);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: "Usuário já curtiu esta resposta." });
    } else {
      res.status(400).json({ error: "Não foi possível adicionar o like. Verifique se a resposta e o usuário existem." });
    }
  }
});

router.delete("/:respostaId/like", async (req, res) => {
  const respostaId = Number(req.params.respostaId);
  const { usuarioId } = req.body;

  if (!usuarioId) {
    res.status(400).json({ error: "O ID do usuário é obrigatório." });
    return;
  }

  try {
    await prisma.like.delete({
      where: {
        usuarioId_respostaId: {
          usuarioId,
          respostaId,
        },
      },
    });
    // A resposta é enviada sem 'return' na frente
    res.status(204).send();
  } catch (error: any) {
    // P2025 é o código de erro do Prisma para "Registro a ser deletado não existe".
    if (error.code === 'P2025') {
       res.status(404).json({ error: "Like não encontrado para este usuário e resposta." });
    } else {
       res.status(500).json({ error: "Erro ao remover o like." });
    }
  }
});

export default router;
