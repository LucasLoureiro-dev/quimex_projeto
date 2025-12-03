// chatRotas.js
import { Server } from "socket.io";
import {
  listarChat,
  criarChat,
  listarChatEntreUsuarios,
} from "../models/Chat.js"; // ajuste caminho se necessário

// -----------------------------------------------------------------------------
// Função auxiliar para converter ISO → formato DATETIME do MySQL
// -----------------------------------------------------------------------------
function formatToMySQLDatetime(value) {
  try {
    const date = value ? new Date(value) : new Date();
    if (isNaN(date.getTime())) return null;

    const Y = date.getFullYear();
    const M = String(date.getMonth() + 1).padStart(2, "0");
    const D = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");

    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
  } catch (err) {
    console.error("Erro ao formatar horário:", err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// FUNÇÃO PRINCIPAL DO CHAT
// -----------------------------------------------------------------------------
export function startChat(server) {
  const io = new Server(server, {
    path: "/chat",
    cors: { origin: "*" },
  });

  // Lista de usuários online
  // socket.id → { id, nome }
  let onlineUsers = new Map();

  // envia lista atualizada para todos
  function broadcastUsers() {
    io.emit("users", Array.from(onlineUsers.values()));
  }

  // ---------------------------------------------------------------------------
  // EVENTO: Conexão inicial
  // ---------------------------------------------------------------------------
  io.on("connection", (socket) => {
    console.log("🔵 Novo usuário conectado:", socket.id);

    // -------------------------------------------------------------------------
    // 1) Login do usuário (mantido, só aceita objeto)
    // Esperado: socket.emit("usuario", { id: X, nome: "Fulano" })
    // -------------------------------------------------------------------------
    socket.on("usuario", (userObj) => {
      if (!userObj) return;
      onlineUsers.set(socket.id, userObj);

      console.log("👤 Usuário logado:", userObj);
      broadcastUsers();
    });

    // -------------------------------------------------------------------------
    // 2) MENSAGEM PÚBLICA (compatível com sua versão antiga)
    // -------------------------------------------------------------------------
    socket.on("msg", (data) => {
      console.log("💬 Mensagem pública:", data);
      io.emit("msg", data);
    });

    // -------------------------------------------------------------------------
    // 3) MENSAGEM PRIVADA ENTRE USUÁRIOS
    // data = { de, para, conteudo, horario? }
    // -------------------------------------------------------------------------
    socket.on("private_message", async (data) => {
      try {
        if (!data || !data.de || !data.para || !data.conteudo) {
          console.warn("⚠️ private_message recebido com dados inválidos:", data);
          return;
        }

        // Formatar horário corretamente
        const horarioFmt = formatToMySQLDatetime(data.horario);

        const payload = {
          de: data.de,
          para: data.para,
          conteudo: data.conteudo,
          horario: horarioFmt || formatToMySQLDatetime(),
        };

        console.log("💾 Salvando mensagem privada:", payload);

        // Salva no banco usando sua função existente
        await criarChat(payload);

        // Envia a mensagem apenas ao remetente e destinatário
        for (const [sockId, u] of onlineUsers.entries()) {
          const uId = typeof u === "object" ? u.id : u;
          if (
            String(uId) === String(payload.de) ||
            String(uId) === String(payload.para)
          ) {
            io.to(sockId).emit("private_message", {
              de: payload.de,
              para: payload.para,
              conteudo: payload.conteudo,
              horario: payload.horario,
            });
          }
        }
      } catch (err) {
        console.error("❌ Erro ao tratar private_message:", err);
      }
    });

    // -------------------------------------------------------------------------
    // 4) HISTÓRICO ENTRE DOIS USUÁRIOS
    // data = { de, para }
    // -------------------------------------------------------------------------
    socket.on("request_chat_history", async (data) => {
      try {
        if (!data || !data.de || !data.para) {
          socket.emit("chat_history", { messages: [] });
          return;
        }

        console.log("📜 Pedindo histórico:", data);

        const msgs = await listarChatEntreUsuarios(data.de, data.para);

        socket.emit("chat_history", { messages: msgs });
      } catch (err) {
        console.error("❌ Erro ao listar histórico:", err);
        socket.emit("chat_history", { messages: [] });
      }
    });

    // -------------------------------------------------------------------------
    // 5) DESCONEXÃO
    // -------------------------------------------------------------------------
    socket.on("disconnect", () => {
      console.log("⚫ Usuário desconectado:", socket.id);

      onlineUsers.delete(socket.id);
      broadcastUsers();
    });
  });
}

export default startChat;
