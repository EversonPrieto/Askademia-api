import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import upload from '../config/cloudinary'; 

const prisma = new PrismaClient();
const router = Router();

router.post("/", upload.single('imagem'), async (req, res) => {
  const { descricao, perguntaId, usuarioId } = req.body;
  const imagemUrl = req.file?.path;

  if (!descricao || !perguntaId || !usuarioId) {
    res.status(400).json({ error: "Descrição, ID da pergunta e ID do usuário são obrigatórios." });
    return;
  }

  try {
    const resposta = await prisma.resposta.create({
      data: {
        descricao,
        perguntaId: Number(perguntaId),
        usuarioId: Number(usuarioId),
        imagemUrl: imagemUrl,
      },
    });
    res.status(201).json(resposta);
  } catch (error) {
    console.error("Erro ao criar resposta:", error);
    res.status(400).json({ error: "Erro ao criar resposta. Verifique os dados fornecidos." });
  }
});

router.get("/", async (req, res) => {
  try {
    const respostas = await prisma.resposta.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        descricao: true,
        createdAt: true,
        imagemUrl: true,
        usuario: {
          select: {
            nome: true,
            tipo: true,
          }
        },
        pergunta: {
          select: {
            titulo: true,
            disciplinaId: true
          }
        }
      }
    });
    res.status(200).json(respostas);
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
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
      return;
    }
    res.json(resposta);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar resposta." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { descricao, usuarioId } = req.body;

  if (!usuarioId) {
    res.status(401).json({ error: "Acesso não autorizado. ID do usuário não fornecido." });
    return;
  }

  try {
    const resposta = await prisma.resposta.findUnique({ where: { id } });
    if (!resposta) {
      res.status(404).json({ error: "Resposta não encontrada." });
      return;
    }

    if (resposta.usuarioId !== Number(usuarioId)) {
      res.status(403).json({ error: "Você não tem permissão para editar esta resposta." });
      return;
    }

    const respostaAtualizada = await prisma.resposta.update({
      where: { id },
      data: { descricao },
    });
    res.json(respostaAtualizada);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar resposta." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { usuarioId } = req.body;

  if (!usuarioId) {
    res.status(401).json({ error: "Acesso não autorizado. ID do usuário não fornecido." });
    return;
  }

  try {
    const resposta = await prisma.resposta.findUnique({ where: { id } });
    if (!resposta) {
      res.status(404).json({ error: "Resposta não encontrada." });
      return;
    }
    
    if (resposta.usuarioId !== Number(usuarioId)) {
      res.status(403).json({ error: "Você não tem permissão para deletar esta resposta." });
      return;
    }

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
    const newLike = await prisma.likeResposta.create({
      data: {
        respostaId,
        usuarioId: Number(usuarioId),
      },
    });
    res.status(201).json(newLike);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: "Usuário já curtiu esta resposta." });
      return;
    }
    res.status(400).json({ error: "Não foi possível adicionar o like." });
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
    await prisma.likeResposta.delete({
      where: {
        usuarioId_respostaId: {
          usuarioId: Number(usuarioId),
          respostaId,
        },
      },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: "Like não encontrado para este usuário e resposta." });
      return;
    }
    res.status(500).json({ error: "Erro ao remover o like." });
  }
});

export default router;