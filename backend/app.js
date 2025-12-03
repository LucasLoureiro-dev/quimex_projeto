import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { createServer } from "http";
import usuario from "./routes/usuarioRotas.js";
import login from "./routes/authRotas.js";
import chat from "./routes/chatRotas.js";
import startChat from "./routes/chatRotas.js";
import dashboard from "./routes/dashboadRota.js";
import lojas from "./routes/lojasRotas.js";
import contas from "./routes/contasRotas.js";
import despesas from "./routes/despesasRotas.js";
import controle_diario from "./routes/controle_diarioRotas.js";
import transferencias from "./routes/tranferenciaRotas.js"

// 1. Carrega variáveis de ambiente PRIMEIRO
dotenv.config();

// 2. Configuração básica do Express
const app = express();
const server = createServer(app);

startChat(server);

const porta = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: "sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);


app.use("/usuarios", usuario);
app.use("/chat", chat);
app.use("/login", login);
app.use("/dashboard", dashboard);
app.use("/lojas", lojas);
app.use("/contas", contas)
app.use("/transferencias", transferencias)
app.use("/controle_diario", controle_diario)
app.use("/despesas", despesas)

server
  .listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
  })
  .on("error", (err) => {
    console.error("Erro ao iniciar:", err);
  });

// 8. Encerramento elegante
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Servidor encerrado");
  });
});
