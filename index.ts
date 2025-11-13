import express from "express";
import cors from "cors";
import adminsRouter from "./src/routes/admins";
import usuariosRouter from "./src/routes/usuarios";
import perguntasRouter from "./src/routes/perguntas";
import respostasRouter from "./src/routes/respostas";
import displinasRouter from "./src/routes/disciplinas";
import denunciasRouter from "./src/routes/denuncias";
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
app.use("/denuncias", denunciasRouter);


app.get("/", (req, res) => {
  res.send("API: Sistema Askademia - Q&A");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
