import {
  readAll,
  read_some,
  update,
  deleteRecord,
  create,
  read,
} from "../config/database.js";

const listar_estoque = async () => {
  try {
    return await readAll("fornecedores");
  } catch (err) {
    console.log(`Houve um erro ao listar os fornecedores: ${err}`);
    throw new Error("Falha ao listar os fornecedores");
  }
};

const criar_estoque = async (data) => {
  try {
    return await create("fornecedores", data);
  } catch (err) {
    console.log(`Houve um erro ao criar o fornecedor: ${err}`);
    throw new Error("Falha ao criar os fornecedor");
  }
};

const atualizar_estoque = async (id) => {
  try {
    return await update("fornecedores", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar o fornecedor: ${err}`);
    throw new Error("Falha ao atualizar o fornecedor");
  }
};

const excluir_estoque = async (id) => {
  try {
    return await deleteRecord("fornecedores", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir o fornecedor: ${err}`);
    throw new Error("Falha ao excluir o fornecedor");
  }
};

export { listar_estoque, criar_estoque, atualizar_estoque, excluir_estoque };