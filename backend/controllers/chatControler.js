import { listarChat, criarChat } from "../models/Chat.js";

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

const criar_chatController = async (req, res) => {
  try {
    const { de, para, conteudo, horario } = req.body
    const data = {
        de: de,
        para: para,
        conteudo: conteudo,
        horario: horario
    }
    const criaChat = await criarChat(data)
  } catch (err) {
    console.error("Erro criando mensagem:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar mensagem", error: err.message });
  }
};

export { listar_chatController, criar_chatController };
