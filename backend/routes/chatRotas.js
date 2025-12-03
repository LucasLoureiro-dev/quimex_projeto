// chatRotas.js
import { Server } from "socket.io";
import {
  listarChat,
  criarChat,
  listarChatEntreUsuarios,
} from "../models/Chat.js"; // ajuste caminho conforme sua estrutura

// formata ISO (ou Date) para 'YYYY-MM-DD HH:MM:SS'
function formatToMySQLDatetime(value) {
  if (!value) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ` +
      `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  }

  // se for Date object
  const date = (value instanceof Date) ? value : new Date(value);
  if (isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ` +
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

export function startChat(server) {
  const io = new Server(server, {
    path: "/chat",
    cors: { origin: "*" },
  });

  let onlineUsers = new Map(); // socket.id -> { id, nome, ... }

  // envia lista para todos (array de objetos de usuário)
  function broadcastUsers() {
    io.emit("users", Array.from(onlineUsers.values()));
  }

  io.on("connection", (socket) => {
    console.log("🔵 Usuário conectado:", socket.id);

    // quando o usuário loga: espera receber um objeto { id, nome } (ou pelo menos id)
    socket.on("usuario", (userObj) => {
      if (!userObj) return;
      // userObj pode ser só o nome ou { id, nome }. Vamos guardar como objeto.
      // Recomendado: enviar { id, nome } do frontend.
      onlineUsers.set(socket.id, userObj);
      console.log("👤 Usuário entrou:", userObj);
      broadcastUsers();
    });

    // Mensagens públicas (mantive para compatibilidade)
    socket.on("msg", (data) => {
      console.log("💬 Mensagem pública recebida:", data);
      io.emit("msg", data);
    });

    // Mensagem privada entre dois usuários
    // data: { de, para, conteudo, horario? }
    socket.on("private_message", async (data) => {
      try {
        if (!data || !data.de || !data.para || !data.conteudo) {
          console.warn("private_message: payload inválido", data);
          return;
        }

        // garante que horario esteja no formato MySQL DATETIME 'YYYY-MM-DD HH:MM:SS'
        const horarioFmt = formatToMySQLDatetime(data.horario);

        if (!horarioFmt) {
          console.warn("private_message: horário inválido fornecido, usando NOW()");
        }

        const payload = {
          de: data.de,
          para: data.para,
          conteudo: data.conteudo,
          horario: horarioFmt || formatToMySQLDatetime() // se horário inválido, usa o current time formatado
        };

        // salva no DB usando criarChat (seu helper)
        await criarChat(payload);

        // encaminha apenas para sockets dos 2 usuários (remetente e destinatário)
        for (const [sockId, u] of onlineUsers.entries()) {
          const uId = u && typeof u === "object" ? u.id : u;
          if (String(uId) === String(payload.de) || String(uId) === String(payload.para)) {
            io.to(sockId).emit("private_message", {
              de: payload.de,
              para: payload.para,
              conteudo: payload.conteudo,
              horario: payload.horario,
            });
          }
        }
      } catch (err) {
        console.error("Erro ao tratar private_message:", err);
      }
    });

    // Pedido de histórico entre dois usuários
    // data: { de, para }
    socket.on("request_chat_history", async (data) => {
      try {
        if (!data || !data.de || !data.para) {
          socket.emit("chat_history", { chat_id: null, messages: [] });
          return;
        }

        const msgs = await listarChatEntreUsuarios(data.de, data.para);
        socket.emit("chat_history", { messages: msgs });
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        socket.emit("chat_history", { messages: [] });
      }
    });

    socket.on("disconnect", () => {
      console.log("⚫ Desconectou:", onlineUsers.get(socket.id));
      onlineUsers.delete(socket.id);
      broadcastUsers();
    });
  });
}

export default startChat;
