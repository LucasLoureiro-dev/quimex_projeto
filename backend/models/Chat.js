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

export { listarChat, criarChat };
