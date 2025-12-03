import {
  readAll,
  update,
  deleteRecord,
  create,
} from "../config/database.js";

const listar_despesas = async () => {
  try {
    return await readAll("despesas");
  } catch (err) {
    console.log(`Houve um erro ao listar as despesas: ${err}`);
    throw new Error("Falha ao listar as despesas");
  }
};

const criar_despesa = async (data) => {
  try {
    return await create("despesas", data);
  } catch (err) {
    console.log(`Houve um erro ao criar a despesas: ${err}`);
    throw new Error("Falha ao criar a despesas");
  }
};

const atualizar_despesa = async (id) => {
  try {
    return await update("despesas", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar a despesas: ${err}`);
    throw new Error("Falha ao atualizar a despesas");
  }
};

const excluir_despesa = async (id) => {
  try {
    return await deleteRecord("despesas", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir a despesas: ${err}`);
    throw new Error("Falha ao excluir a despesas");
  }
};

export {listar_despesas, criar_despesa, atualizar_despesa, excluir_despesa}