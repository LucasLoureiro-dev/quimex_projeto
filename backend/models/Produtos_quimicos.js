import {
  readAll,
  read_some,
  update,
  deleteRecord,
  create,
  read,
} from "../config/database.js";

const listar_produtosQuimicos = async () => {
  try {
    return await readAll("produtos_quimicos");
  } catch (err) {
    console.log(`Houve um erro ao listar os produtos quimicos: ${err}`);
    throw new Error("Falha ao listar os produtos quimicos");
  }
};

const criar_produtoQuimicos = async (data) => {
  try {
    return await create("produtos_quimicos", data);
  } catch (err) {
    console.log(`Houve um erro ao criar o produtos quimicos: ${err}`);
    throw new Error("Falha ao criar os produtos quimicos");
  }
};

const atualizar_produtoQuimico = async (id) => {
  try {
    return await update("produtos_quimicos", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar o produtos quimicos: ${err}`);
    throw new Error("Falha ao atualizar o produtos quimicos");
  }
};

const excluir_produtoQuimico = async (id) => {
  try {
    return await deleteRecord("produtos_quimicos", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir o produtos quimicos: ${err}`);
    throw new Error("Falha ao excluir o produtos quimicos");
  }
};

export { listar_produtosQuimicos, criar_produtoQuimicos, atualizar_produtoQuimico, excluir_produtoQuimico };