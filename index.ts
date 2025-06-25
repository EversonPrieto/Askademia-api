import express from "express";
import cors from "cors";
import adminsRouter from "./routes/admins";
import usuariosRouter from "./routes/usuarios";
import perguntasRouter from "./routes/perguntas";
import respostasRouter from "./routes/respostas";
import displinasRouter from "./routes/disciplinas";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

app.use("/admins", adminsRouter);
app.use("/usuarios", usuariosRouter);
app.use("/perguntas", perguntasRouter);
app.use("/respostas", respostasRouter);
app.use("/disciplinas", displinasRouter);


app.get("/", (req, res) => {
  res.send("API: Sistema Askademia - Q&A");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
