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
 * Retorna mensagens entre dois usuários (de <-> para).
 * Usa listarChat() e filtra em memória para compatibilidade com seu helper atual.
 * @param {number|string} de
 * @param {number|string} para
 * @returns {Array}
 */
const listarChatEntreUsuarios = async (de, para) => {
  try {
    const all = await listarChat();
    // Assumimos que os campos na tabela são: de, para, conteudo, horario
    const filtered = all.filter((row) => {
      return (
        (String(row.de) === String(de) && String(row.para) === String(para)) ||
        (String(row.de) === String(para) && String(row.para) === String(de))
      );
    });
    // padroniza saída para frontend (sender_id, message, timestamp)
    return filtered.map((r) => ({
      id: r.id,
      sender_id: r.de,
      receiver_id: r.para,
      message: r.conteudo,
      timestamp: r.horario || r.timestamp || r.created_at || null,
    }));
  } catch (error) {
    console.error("Erro ao filtrar chats entre usuários:", error);
    throw error;
  }
};

export { listarChat, criarChat, listarChatEntreUsuarios };
