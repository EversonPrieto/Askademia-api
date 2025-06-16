import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { titulo, descricao, usuarioId } = req.body;

  try {
    const pergunta = await prisma.pergunta.create({
      data: { titulo, descricao, usuarioId },
    });
    res.status(201).json(pergunta);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar pergunta." });
  }
});


router.get("/", async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        usuario: true, 
        respostas: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            usuario: true, 
          },
        },
      },
    });
    res.json(perguntas);
  } catch (error) {
    console.error("Erro detalhado ao buscar perguntas:", error); 
    res.status(500).json({ error: "Erro ao buscar perguntas." });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const pergunta = await prisma.pergunta.findUnique({
      where: { id },
      include: {
        usuario: true,
        respostas: {
          include: { usuario: true }
        },
      },
    });
    if (!pergunta) 
        res.status(404).json({ error: "Pergunta não encontrada." });
        res.json(pergunta);
  } catch (error) {
        res.status(500).json({ error: "Erro ao buscar pergunta." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descricao } = req.body;

  try {
    const pergunta = await prisma.pergunta.update({
      where: { id },
      data: { titulo, descricao },
    });
    res.json(pergunta);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar pergunta." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.pergunta.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar pergunta." });
  }
});

export default router;
