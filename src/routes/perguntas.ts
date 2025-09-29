import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import upload from '../config/cloudinary';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const router = Router();

export async function isContentInappropriate(text: String) {
  try {
    const response = await axios.post(
      "https://api.z.ai/api/paas/v4/chat/completions",
      {
        model: "GLM-4.5-Flash", // Or another suitable model from Z.AI
        messages: [
          {
            role: "system",
            content: "You are a content moderator. Your task is to determine if the following text contains any profanity, hate speech, or inappropriate content. Respond with 'yes' if it does, and 'no' if it does not."
          },
          {
            role: "user",
            content: text
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.ZAI_API_KEY}`
        }
      }
    );

    const decision = response.data.choices[0].message.content.trim().toLowerCase();
    return decision === 'yes';
  } catch (error) {
    console.error("Error calling Z.AI API:", error);
    return false;
  }
}

router.post("/", upload.single('imagem'), async (req, res) => {
  const { titulo, descricao, usuarioId, disciplinaId } = req.body;
  const imagemUrl = req.file?.path;

  if (!titulo || !usuarioId || !disciplinaId) {
    res.status(400).json({ erro: "Título, ID do usuário e ID da disciplina são obrigatórios." });
    return;
  }

  const contentToCheck = `${titulo} ${descricao || ""}`;

  const inappropriate = await isContentInappropriate(contentToCheck);

  if (inappropriate) {
    res.status(400).json({ erro: "A pergunta contém conteúdo impróprio e não pode ser postada." });
    return;
  }

  try {
    const pergunta = await prisma.pergunta.create({
      data: {
        titulo,
        descricao: descricao || "",
        usuarioId: Number(usuarioId),
        disciplinaId: Number(disciplinaId),
        imagemUrl: imagemUrl,
      },
    });
    res.status(201).json(pergunta);
  } catch (error) {
    console.error("Erro ao criar pergunta:", error);
    res.status(400).json({ error: "Erro ao criar pergunta. Verifique os dados fornecidos." });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const pergunta = await prisma.pergunta.findUnique({
      where: { id },
      include: {
        usuario: true,
        _count: {
          select: { likes: true }
        },
        respostas: {
          include: {
            usuario: true,
            likes: true,
            _count: {
              select: { likes: true }
            }
          }
        },
      },
    });
    if (!pergunta) {
      res.status(404).json({ error: "Pergunta não encontrada." });
    } else {
      res.json(pergunta);
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pergunta." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descricao, usuarioId } = req.body;

  if (!usuarioId) {
    res.status(401).json({ error: "Acesso não autorizado. ID do usuário não fornecido." });
    return;
  }

  try {
    const pergunta = await prisma.pergunta.findUnique({ where: { id } });
    if (!pergunta) {
      res.status(404).json({ error: "Pergunta não encontrada." });
      return;
    }

    if (pergunta.usuarioId !== Number(usuarioId)) {
      res.status(403).json({ error: "Você não tem permissão para editar esta pergunta." });
      return;
    }

    const perguntaAtualizada = await prisma.pergunta.update({
      where: { id },
      data: { titulo, descricao },
    });
    res.json(perguntaAtualizada);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar pergunta." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { usuarioId, usuarioTipo } = req.body;

  if (!usuarioId || !usuarioTipo) {
    res.status(401).json({ error: "Acesso não autorizado." });
    return;
  }

  try {
    const pergunta = await prisma.pergunta.findUnique({ where: { id } });
    if (!pergunta) {
      res.status(404).json({ error: "Pergunta não encontrada." });
      return;
    }

    if (pergunta.usuarioId !== Number(usuarioId) && usuarioTipo !== 'PROFESSOR') {
      res.status(403).json({ error: "Você não tem permissão para deletar esta pergunta." });
      return;
    }

    await prisma.pergunta.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar pergunta." });
  }
});

router.post("/:perguntaId/like", async (req, res) => {
  const perguntaId = Number(req.params.perguntaId);
  const { usuarioId } = req.body;

  if (!usuarioId) {
    res.status(400).json({ error: "O ID do usuário é obrigatório." });
    return;
  }

  try {
    const newLike = await prisma.likePergunta.create({
      data: {
        perguntaId,
        usuarioId: Number(usuarioId),
      },
    });
    res.status(201).json(newLike);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: "Usuário já curtiu esta pergunta." });
      return
    }
    res.status(400).json({ error: "Não foi possível adicionar o like." });
  }
});

router.delete("/:perguntaId/like", async (req, res) => {
  const perguntaId = Number(req.params.perguntaId);
  const { usuarioId } = req.body;

  if (!usuarioId) {
    res.status(400).json({ error: "O ID do usuário é obrigatório." });
    return;
  }

  try {
    await prisma.likePergunta.delete({
      where: {
        usuarioId_perguntaId: {
          usuarioId: Number(usuarioId),
          perguntaId,
        },
      },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: "Like não encontrado para este usuário e pergunta." });
      return;
    }
    res.status(500).json({ error: "Erro ao remover o like." });
  }
});

export default router;