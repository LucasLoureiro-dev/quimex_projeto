import {
  readAll,
  update,
  deleteRecord,
  create,
} from "../config/database.js";

const listar_usuarios = async () => {
  try {
    return await readAll("usuarios");
  } catch (err) {
    console.log(`Houve um erro listando os usuários: ${err}`);
    throw new Error("Falha ao listar os usuários");
  }
};

const criar_usuario = async (data) => {
  try {
    return await create("usuarios", data);
  } catch (err) {
    console.log(`Houve um erro criando usuário: ${err}`);
    throw new Error("Falha ao criar usuário");
  }
};

const update_usuario = async (id, data) => {
  try {
    return await update("usuarios", data, `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro atualizando usuário: ${err}`);
    throw new Error("Falha ao atualizar usuário");
  }
};

const delete_usuario = async (id) => {
  try {
    return await deleteRecord("usuarios", `id = '${id}'`);
  } catch (err) {
    console.log(`Houve um erro atualizando usuário: ${err}`);
    throw new Error("Falha ao atualizar usuário");
  }
};

export { listar_usuarios, criar_usuario, update_usuario, delete_usuario };
