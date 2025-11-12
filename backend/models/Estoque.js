import {
  readAll,
  update,
  deleteRecord,
  create,
  read,
} from "../config/database.js";

const listar_estoque = async () => {
  try {
    return await readAll("estoque");
  } catch (err) {
    console.log(`Houve um erro ao listar o estoque: ${err}`);
    throw new Error("Falha ao listar o estoque");
  }
};

const criar_estoque = async (data) => {
  try {
    return await create("estoque", data);
  } catch (err) {
    console.log(`Houve um erro ao criar o estoque: ${err}`);
    throw new Error("Falha ao criar os estoque");
  }
};

const atualizar_estoque = async (id) => {
  try {
    return await update("estoque", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar o estoque: ${err}`);
    throw new Error("Falha ao atualizar o estoque");
  }
};

const excluir_estoque = async (id) => {
  try {
    return await deleteRecord("estoque", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir o estoque: ${err}`);
    throw new Error("Falha ao excluir o estoque");
  }
};

export { listar_estoque, criar_estoque, atualizar_estoque, excluir_estoque };