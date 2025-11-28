import {
  readAll,
  update,
  deleteRecord,
  create,
} from "../config/database.js";

const listar_contas = async () => {
  try {
    return await readAll("contas");
  } catch (err) {
    console.log(`Houve um erro ao listar as contas: ${err}`);
    throw new Error("Falha ao listar as contas");
  }
};

const criar_conta = async (data) => {
  try {
    return await create("contas", data);
  } catch (err) {
    console.log(`Houve um erro ao criar a contas: ${err}`);
    throw new Error("Falha ao criar a contas");
  }
};

const atualizar_conta = async (id) => {
  try {
    return await update("contas", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar a contas: ${err}`);
    throw new Error("Falha ao atualizar a contas");
  }
};

const excluir_conta = async (id) => {
  try {
    return await deleteRecord("contas", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir a contas: ${err}`);
    throw new Error("Falha ao excluir a contas");
  }
};

export {listar_contas, criar_conta, atualizar_conta, excluir_conta}