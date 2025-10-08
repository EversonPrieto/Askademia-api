import { PrismaClient, TipoUsuario } from "@prisma/client";
import { Router } from "express";
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer"

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
  const { nome, email, senha, matricula, cpf } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Informe nome, email e senha" });
    return;
  }

  const erros = validaSenha(senha);
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") });
    return;
  }

  if (!matricula && !cpf) {
    res.status(400).json({ erro: "É necessário informar matrícula ou CPF para o cadastro." });
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(senha, salt);

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hash,
        matricula: matricula || null,
        cpf: cpf || null
      }
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { identificador, senha } = req.body;
  const mensagemPadrao = "Login ou Senha incorretos";

  if (!identificador || !senha) {
    res.status(400).json({ erro: mensagemPadrao });
    return;
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { matricula: identificador },
          { cpf: identificador },
        ],
      },
    });

    if (usuario == null) {
      res.status(400).json({ erro: mensagemPadrao });
      return;
    }

    if (bcrypt.compareSync(senha, usuario.senha)) {
      res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
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
  const { nome, email, senha, matricula, cpf } = req.body;

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
      data: { 
        nome, 
        email, 
        senha: hash,
        matricula: matricula, 
        cpf: cpf            
      }
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

router.get("/:id/perguntas", async (req, res) => {
  const usuarioId = Number(req.params.id);

  try {
    const perguntas = await prisma.pergunta.findMany({
      where: {
        usuarioId: usuarioId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        disciplina: {
          select: {
            nome: true,
          }
        },
        _count: {
          select: {
            respostas: true
          }
        }
      }
    });
    res.status(200).json(perguntas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as perguntas do usuário." });
  }
});

router.post("/recuperar-senha", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ erro: "Informe o e-mail" });
    return;
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: { email },
    });

    if (!usuario) {
      res.status(400).json({ erro: "E-mail não cadastrado" });
      return;
    }

    const codigoRecuperacao = String(Math.floor(1000 + Math.random() * 9000));
    const agora = new Date();

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { 
        codigoRecuperacao, 
        codigoGeradoAt: agora
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_EMAIL,
      to: email,
      subject: "Recuperação de senha",
      text: `Seu código de recuperação é: ${codigoRecuperacao}`,
    });

    res.status(200).json({ mensagem: "Código de recuperação enviado com sucesso" });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/alterar-senha", async (req, res) => {
  const { email, codigoRecuperacao, novaSenha } = req.body;

  if (!email || !codigoRecuperacao || !novaSenha) {
    res.status(400).json({ erro: "Informe o e-mail, código de recuperação e nova senha" });
    return;
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: { email },
    });

    if (!usuario) {
      res.status(400).json({ erro: "E-mail não cadastrado" });
      return;
    }

    const agora = new Date();
    const dezMinutos = 10 * 60 * 1000;
    const codigoGeradoAt = usuario.codigoGeradoAt;

    if (
      usuario.codigoRecuperacao !== codigoRecuperacao || 
      !codigoGeradoAt ||
      (agora.getTime() - new Date(codigoGeradoAt).getTime()) > dezMinutos
    ) {
      res.status(400).json({ erro: "Código de recuperação inválido ou expirado" });
      return;
    }

    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(novaSenha, salt);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { senha: hash, codigoRecuperacao: null, codigoGeradoAt: null },
    });

    res.status(200).json({ mensagem: "Senha alterada com sucesso" });
  } catch (error) {
    res.status(400).json(error);
  }
});


export default router;