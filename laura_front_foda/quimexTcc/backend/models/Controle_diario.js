import {
  readAll,
  update,
  deleteRecord,
  create,
} from "../config/database.js";

const listar_controleDiario = async () => {
  try {
    return await readAll("lojas");
  } catch (err) {
    console.log(`Houve um erro ao listar as lojas: ${err}`)
        throw new Error("Falha ao listar as lojas");
  }
};
const criar_controleDiario = async (data) => {
  try {
    return await create("lojas", data);
  } catch (err) {
    console.log(`Houve um erro ao criar a loja: ${err}`);
    throw new Error("Falha ao criar a loja");
  }
};

export {listar_controleDiario, criar_controleDiario}