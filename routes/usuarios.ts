import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha },
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário." });
  }
});

router.get('/', async (req, res) => {
    try {
      const usuarios = await prisma.usuario.findMany()
      res.status(200).json(usuarios)
    } catch (error) {
      res.status(400).json(error)
    }
  })

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { nome, email, senha },
    });

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.usuario.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar usuário." });
  }
});

export default router;
