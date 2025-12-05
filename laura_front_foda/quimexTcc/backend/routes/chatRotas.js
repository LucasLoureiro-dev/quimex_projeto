import { Server } from "socket.io";
import { criarChat, listarChatEntreUsuarios } from "../models/Chat.js";

/** Formato DATETIME válido */
function formatToMySQLDatetime(date) {
  const d = new Date(date);
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

export function startChat(server) {
  const io = new Server(server, {
    path: "/chat",
    cors: { origin: "*" }
  });

  const onlineUsers = new Map();

  const broadcastUsers = () => {
    io.emit("users", [...onlineUsers.values()]);
  };

  io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

    // LOGIN DO USUÁRIO
    socket.on("usuario", (userObj) => {
      const loja = Number(
        userObj.loja_vinculada ??
        userObj.Loja_vinculada ??
        null
      );

      onlineUsers.set(socket.id, {
        socketId: socket.id,
        id: userObj.id,
        nome: userObj.nome ?? userObj.usuario,
        cargo: userObj.cargo,
        vinculo: userObj.vinculo,
        loja_vinculada: loja
      });

      broadcastUsers();
    });

    // ENVIAR MENSAGEM PRIVADA
    // chatRotas.js (trecho relevante - substitua o handler private_message pelo código abaixo)
    socket.on("private_message", async (msg) => {
      try {
        if (!msg || msg.de == null || msg.para == null || !msg.conteudo) return;

        // se conteudo já for objeto (ex: front enviou {type:'file',...}), garantimos salvar string
        const conteudoParaSalvar = typeof msg.conteudo === "string" ? msg.conteudo : JSON.stringify(msg.conteudo);

        const horario = formatToMySQLDatetime(msg.horario ?? new Date());

        await criarChat({
          de: msg.de,
          para: msg.para,
          conteudo: conteudoParaSalvar,
          horario,
        });

        // reenviar para sockets das lojas envolvidas
        for (const [sockId, usr] of onlineUsers.entries()) {
          if (usr.loja_vinculada == msg.de || usr.loja_vinculada == msg.para) {
            io.to(sockId).emit("private_message", {
              de: msg.de,
              para: msg.para,
              conteudo: conteudoParaSalvar,
              horario,
            });
          }
        }
      } catch (err) {
        console.error("Erro private_message (upload):", err);
      }
    });


    // HISTÓRICO
    socket.on("request_chat_history", async ({ de, para }) => {
      const msgs = await listarChatEntreUsuarios(de, para);
      socket.emit("chat_history", { messages: msgs });
    });

    // DIGITANDO
    socket.on("typing_start", (data) => {
      [...onlineUsers.entries()].forEach(([sid, u]) => {
        if (u.loja_vinculada == data.para) {
          io.to(sid).emit("typing", {
            from: data.de,
            typing: true
          });
        }
      });
    });

    socket.on("typing_stop", (data) => {
      [...onlineUsers.entries()].forEach(([sid, u]) => {
        if (u.loja_vinculada == data.para) {
          io.to(sid).emit("typing", {
            from: data.de,
            typing: false
          });
        }
      });
    });

    // DESCONECTOU
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      broadcastUsers();
    });
  });
}

export default startChat;
