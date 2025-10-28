import {
  readAll,
  read_some,
  update,
  deleteRecord,
  create,
  read,
} from "../config/database.js";

const listar_produtos = async () => {
  try {
    return await readAll("produtos");
  } catch (err) {
    console.log(`Houve um erro ao listar os produtos: ${err}`);
    throw new Error("Falha ao listar os produtos");
  }
};

const criar_produto = async (data) => {
  try {
    return await create("produtos", data);
  } catch (err) {
    console.log(`Houve um erro ao criar o produtos: ${err}`);
    throw new Error("Falha ao criar os produtos");
  }
};

const atualizar_produto = async (id) => {
  try {
    return await update("produtos", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar o produtos: ${err}`);
    throw new Error("Falha ao atualizar o produtos");
  }
};

const excluir_produto = async (id) => {
  try {
    return await deleteRecord("produtos", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir o produtos: ${err}`);
    throw new Error("Falha ao excluir o produtos");
  }
};

export { listar_produtos, criar_produto, atualizar_produto, excluir_produto };
