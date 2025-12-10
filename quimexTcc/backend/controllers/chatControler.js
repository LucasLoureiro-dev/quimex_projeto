// chatControler.js
import { listarChat, criarChat, listarChatEntreUsuarios } from "../models/Chat.js";

/**
 * Lista todos os registros (já existia)
 */
const listar_chatController = async (req, res) => {
  try {
    const chat = await listarChat();
    res.status(200).json(chat);
  } catch (err) {
    console.error("Erro buscando mensagem:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar controle diário", error: err.message });
  }
};

/**
 * Cria mensagem (HTTP)
 * Body esperado: { de, para, conteudo, horario }
 */
const criar_chatController = async (req, res) => {
  try {
    const { de, para, conteudo, horario } = req.body;
    const data = {
      de,
      para,
      conteudo,
      horario,
    };
    const criaChat = await criarChat(data);
    res.status(201).json({ success: true, id: criaChat.insertId ?? criaChat.insert_id ?? null });
  } catch (err) {
    console.error("Erro criando mensagem:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar mensagem", error: err.message });
  }
};

/**
 * Lista histórico entre dois usuários (HTTP)
 * Query params: ?de=ID&para=ID
 */
const listar_chat_entre_usuariosController = async (req, res) => {
  try {
    const de = req.query.de;
    const para = req.query.para;
    if (!de || !para) return res.status(400).json({ message: "de e para são obrigatórios" });

    const msgs = await listarChatEntreUsuarios(de, para);
    res.status(200).json(msgs);
  } catch (err) {
    console.error("Erro ao listar chat entre usuários:", err);
    res.status(500).json({ message: "Erro ao buscar histórico", error: err.message });
  }
};

export {
  listar_chatController,
  criar_chatController,
  listar_chat_entre_usuariosController,
};
