import {
  readAll,
  update,
  deleteRecord,
  create,
} from "../config/database.js";

const listar_transferencias = async () => {
  try {
    return await readAll("transferencias");
  } catch (err) {
    console.log(`Houve um erro ao listar as transferencias: ${err}`);
    throw new Error("Falha ao listar as transferencias");
  }
};

const criar_transferencia = async (data) => {
  try {
    return await create("transferencias", data);
  } catch (err) {
    console.log(`Houve um erro ao criar a transferencias: ${err}`);
    throw new Error("Falha ao criar a transferencias");
  }
};

const atualizar_transferencia = async (id) => {
  try {
    return await update("transferencias", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar a transferencias: ${err}`);
    throw new Error("Falha ao atualizar a transferencias");
  }
};

const excluir_transferencia = async (id) => {
  try {
    return await deleteRecord("transferencias", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao excluir a transferencias: ${err}`);
    throw new Error("Falha ao excluir a transferencias");
  }
};

export {listar_transferencias, criar_transferencia, atualizar_transferencia, excluir_transferencia}