import {
  listar_usuarios,
  criar_usuario,
  update_usuario,
  delete_usuario,
} from "../models/Usuarios.js";
import generateHashedPassword from "../hashPassword.js";

const listar_usuariosController = async (req, res) => {
  try {
    const listaUsuarios = await listar_usuarios();
    res.status(200).json({ listaUsuarios });
  } catch (err) {
    console.error("Erro listando usuarios: ", err);
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar usuarios!", error: err.message });
  }
};

const criar_usuarioController = async (req, res) => {
  try {
    console.log(req)
    const {
      nome,
      email,
      cpf,
      contato,
      cargo,
      loja_vinculada,
      RE,
      senha,
      sexo,
      vinculo
    } = req.body;

    const senhaHasheada = await generateHashedPassword(senha)

    const data = {
      nome: nome,
      email: email,
      cpf: cpf,
      contato: contato,
      cargo: cargo,
      loja_vinculada: loja_vinculada,
      RE: RE,
      senha: senhaHasheada,
      sexo: sexo,
      vinculo: vinculo,
    };
    const criaUsuario = await criar_usuario(data);
    return res.status(200).json({
      mensagem: "Usuário criado com sucesso!",
      id: criaUsuario.insertId,
    });
  } catch (err) {
    console.error("Erro ao criar usuario: ", err);
    res.status(500).json({ mensagem: "Erro ao criar usuario!", erro: err });
  }
};
const update_usuarioController = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nome,
      email,
      cpf,
      contato,
      cargo,
      loja_vinculada,
      RE,
      senha,
      sexo,
      vinculo } = req.body;

    const senhaHasheada = await generateHashedPassword(senha)

    const data = {
      nome: nome,
      email: email,
      cpf: cpf,
      contato: contato,
      cargo: cargo,
      loja_vinculada: loja_vinculada,
      RE: RE,
      senha: senhaHasheada,
      sexo: sexo,
      vinculo: vinculo,
    };
    const atualizaUsuario = await update_usuario(data, id);
    return res.status(200).json({
      mensagem: "Usuário atualizado com sucesso!"
    });
  } catch (err) {
    console.error("Erro ao atualizar usuario: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar usuario!", erro: err });
  }
};

const delete_usuarioController = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUsuario = await delete_usuario(id);
    return res.status(200).json({ mensagem: "Usuário deletado com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar usuario: ", err);
    res.status(500).json({ mensagem: "Erro ao deletar usuario!", erro: err });
  }
};

export {
  listar_usuariosController,
  criar_usuarioController,
  update_usuarioController,
  delete_usuarioController,
};
