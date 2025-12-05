// models/Chat.js
import { readAll, create } from "../config/database.js";

const listarChat = async () => {
  try {
    return await readAll("chat");
  } catch (error) {
    console.log(`Houve um erro ao listar o chat: ${error}`);
    throw new Error("Falha ao ler o chat");
  }
};

const criarChat = async (data) => {
  try {
    return await create("chat", data);
  } catch (error) {
    console.log(`Houve um erro ao criar chat: ${error}`);
    throw new Error("Falha ao criar o chat");
  }
};

/**
 * Lista mensagens entre duas lojas (A ↔ B)
 * Saída padronizada para o front.
 */
const listarChatEntreUsuarios = async (de, para) => {
  try {
    const all = await listarChat();

    const filtered = all.filter((row) => {
      return (
        (String(row.de) === String(de) && String(row.para) === String(para)) ||
        (String(row.de) === String(para) && String(row.para) === String(de))
      );
    });

    // ordena histórico pela data
    filtered.sort((a, b) => new Date(a.horario) - new Date(b.horario));

    return filtered.map((r) => ({
      id: r.id,
      sender_id: r.de,
      receiver_id: r.para,
      message: r.conteudo,
      timestamp: r.horario, // sempre DATETIME válido
    }));
  } catch (error) {
    console.error("Erro ao filtrar chats entre usuários:", error);
    throw error;
  }
};

export { listarChat, criarChat, listarChatEntreUsuarios };
