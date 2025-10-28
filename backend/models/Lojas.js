import { readAll, update, deleteRecord, create } from "../config/database.js";

const listar_lojas = async () => {
  try {
    return await readAll("lojas");
  } catch (err) {
    console.log(`Houve um erro ao listar as lojas: ${err}`);
    throw new Error("Falha ao listar as lojas");
  }
};

const criar_loja = async (data) => {
  try {
    return await create("lojas", data);
  } catch (err) {
    console.log(`Houve um erro ao criar a loja: ${err}`);
    throw new Error("Falha ao criar a loja");
  }
};

const atualizar_loja = async (id, data) => {
  try {
    return await update("lojas", data, `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro ao atualizar a lojaa: ${err}`);
    throw new Error("Falha ao atualizar a loja");
  }
};

const excluir_loja = async (id) => {
  try {
    return await deleteRecord("lojas", `id = '${id}'`);
  } catch (err) {
    if(err.code === 'ER_ROW_IS_REFERENCED_2') {
      return err.code;
    }
    console.log(`Houve um erro ao excluir a loja: ${err}`);
    throw new Error("Falha ao excluir a loja");
  }
};

export { listar_lojas, criar_loja, atualizar_loja, excluir_loja };
