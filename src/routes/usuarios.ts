import { PrismaClient, TipoUsuario } from "@prisma/client";
import { Router } from "express";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json(error);
  }
});

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
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Informe nome, email e senha" });
    return;
  }

  const erros = validaSenha(senha);
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") });
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(senha, salt);

  try {
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hash }
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const mensagemPadrao = "Login ou Senha incorretos";

  if (!email || !senha) {
    res.status(400).json({ erro: mensagemPadrao });
    return;
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuario == null) {
      res.status(400).json({ erro: mensagemPadrao });
      return;
    }

    if (bcrypt.compareSync(senha, usuario.senha)) {
      res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      });
    } else {
      res.status(400).json({ erro: mensagemPadrao });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) }
    });

    if (usuario == null) {
      res.status(400).json({ erro: "Usuário não cadastrado" });
    } else {
      res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/:id/tipo", async (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;

  if (!tipo || !Object.values(TipoUsuario).includes(tipo)) {
    res.status(400).json({ erro: "Tipo de usuário inválido fornecido." })
    return;
  }

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { tipo: tipo },
    });
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar o tipo do usuário." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Informe nome, email e senha" });
    return;
  }

  const erros = validaSenha(senha);
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") });
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(senha, salt);

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nome, email, senha: hash }
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.delete({
      where: { id: Number(id) }
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar usuário" });
  }
});

router.get("/checaMonitor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        tipo: true 
      }
    });

    if (!usuario || (usuario.tipo !== TipoUsuario.MONITOR && usuario.tipo !== TipoUsuario.PROFESSOR)) {
      res.status(200).json(false);
      return 
    }

    res.status(200).json(true);

  } catch (error) {
    console.error("Erro ao checar monitor:", error);
    res.status(400).json({ error: "Erro ao verificar status de monitor." });
  }
});

router.get("/checaProfessor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        tipo: true 
      }
    });

    if (!usuario || usuario.tipo !== TipoUsuario.PROFESSOR) {
      res.status(200).json(false);
      return 
    }

    res.status(200).json(true);

  } catch (error) {
    console.error("Erro ao checar professor:", error);
    res.status(400).json({ error: "Erro ao verificar status de professor." });
  }
});

export default router;