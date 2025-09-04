import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

function validaSenha(senha: string) {
  const mensagens: string[] = [];

  if (senha.length < 8) {
    mensagens.push("Erro... senha deve possuir, no mínimo, 8 caracteres");
  }

  let pequenas = 0;
  let grandes = 0;
  let numeros = 0;
  let simbolos = 0;

  for (const letra of senha) {
    if ((/[a-z]/).test(letra)) {
      pequenas++;
    } else if ((/[A-Z]/).test(letra)) {
      grandes++;
    } else if ((/[0-9]/).test(letra)) {
      numeros++;
    } else {
      simbolos++;
    }
  }

  if (pequenas === 0 || grandes === 0 || numeros === 0 || simbolos === 0) {
    mensagens.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos");
  }

  return mensagens;
}

router.post("/", async (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    res.status(400).json({ erro: "Informe nome e senha" })
    return;
  }

  const erros = validaSenha(senha);
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") })
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(senha, salt);

  try {
    const admin = await prisma.admin.create({
      data: { nome, senha: hash },
      select: {
        id: true,
        nome: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar admin. O nome já pode estar em uso." });
  }
});

router.post("/login", async (req, res) => {
  const { nome, senha } = req.body;
  const mensagemPadrao = "Nome de usuário ou senha incorretos";

  if (!nome || !senha) {
    res.status(400).json({ erro: mensagemPadrao })
    return ;
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { nome }
    });

    if (admin == null) {
      res.status(401).json({ erro: mensagemPadrao })
      return;
    }

    if (bcrypt.compareSync(senha, admin.senha)) {

      const token = jwt.sign(
        { id: admin.id, nome: admin.nome },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        id: admin.id,
        nome: admin.nome,
        token: token 
      });

    } else {
      res.status(401).json({ erro: mensagemPadrao });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        createdAt: true
      }
    });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar administradores." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, senha } = req.body;

  if (!nome && !senha) {
    res.status(400).json({ erro: "Informe o nome ou a senha para atualizar." })
    return;
  }

  const dataToUpdate: { nome?: string; senha?: string } = {};

  if (nome) {
    dataToUpdate.nome = nome;
  }

  if (senha) {
    const erros = validaSenha(senha);
    if (erros.length > 0) {
       res.status(400).json({ erro: erros.join("; ") })
       return;
    }
    const salt = bcrypt.genSaltSync(12);
    dataToUpdate.senha = bcrypt.hashSync(senha, salt);
  }

  try {
    const admin = await prisma.admin.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        nome: true,
        updatedAt: true
      }
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar admin. O ID pode não existir ou o nome já está em uso." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.admin.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar admin. O ID pode não existir." });
  }
});

export default router;