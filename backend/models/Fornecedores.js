import {
  readAll,
  update,
  deleteRecord,
  create,
} from "../config/database.js";

const listar_fornecedores = async () => {
  try {
    return await readAll("fornecedores");
  } catch (err) {
    console.log(`Houve um erro ao listar os fornecedores: ${err}`);
    throw new Error("Falha ao listar os fornecedores");
  }
};

const criar_fornecedores = async (data) => {
  try {
    return await create("fornecedores", data);
  } catch (err) {
    console.log(`Houve um erro ao criar o fornecedor: ${err}`);
    throw new Error("Falha ao criar os fornecedor");
  }
};

const atualizar_fornecedores = async (id) => {
  try {
    return await update("fornecedores", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar o fornecedor: ${err}`);
    throw new Error("Falha ao atualizar o fornecedor");
  }
};

const excluir_fornecedores = async (id) => {
  try {
    return await deleteRecord("fornecedores", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir o fornecedor: ${err}`);
    throw new Error("Falha ao excluir o fornecedor");
  }
};

export { listar_fornecedores, criar_fornecedores, atualizar_fornecedores, excluir_fornecedores };