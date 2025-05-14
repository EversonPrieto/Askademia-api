import express from "express";
import usuariosRouter from "./routes/usuarios";
import cors from "cors";

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRouter)

app.get("/", (req, res) => {
  res.send("API: Sistema Askademia");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta:${PORT}`);
});
