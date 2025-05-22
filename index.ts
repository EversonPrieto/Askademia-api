import express from "express";
import cors from "cors";
import usuariosRouter from "./routes/usuarios";
import perguntasRouter from "./routes/perguntas";
import respostasRouter from "./routes/respostas";

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/perguntas", perguntasRouter);
app.use("/respostas", respostasRouter);

app.get("/", (req, res) => {
  res.send("API: Sistema Askademia - Q&A");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
