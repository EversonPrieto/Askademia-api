import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    res.status(400).json({ erro: "O nome da disciplina é obrigatório." })
    return;
  }

  try {
    const disciplina = await prisma.disciplina.create({
      data: { nome },
    });
    res.status(201).json(disciplina);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar disciplina. O nome já pode existir." });
  }
});

router.get("/", async (req, res) => {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      orderBy: {
        nome: 'asc'
      }
    });
    res.status(200).json(disciplinas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar disciplinas." });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const disciplina = await prisma.disciplina.findUnique({
      where: { id },
    });
    if (!disciplina) {
      res.status(404).json({ error: "Disciplina não encontrada." })
      return;
    }
    res.json(disciplina);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar disciplina." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome } = req.body;

  if (!nome) {
    res.status(400).json({ erro: "O nome da disciplina é obrigatório." })
    return;
  }

  try {
    const disciplina = await prisma.disciplina.update({
      where: { id },
      data: { nome },
    });
    res.json(disciplina);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar disciplina. O ID pode não existir ou o nome já está em uso." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.disciplina.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar disciplina. Verifique se ela não está sendo usada em alguma pergunta." });
  }
});

router.get("/:id/perguntas", async (req, res) => {
  const disciplinaId = Number(req.params.id);

  try {
    const perguntas = await prisma.pergunta.findMany({
      where: {
        disciplinaId: disciplinaId,
      },
      include: {
        usuario: true,
        respostas: {
          include: {
            usuario: true,
            likes: true,
            _count: {
              select: { likes: true }
            }
          },
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json(perguntas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perguntas da disciplina." });
  }
});

export default router;