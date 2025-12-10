import {
  listar_usuarios,
  criar_usuario,
  update_usuario,
  delete_usuario,
} from "../models/usuarios.js";
import generateHashedPassword from "../hashPassword.js";

const listar_usuariosController = async (req, res) => {
  try {
    const listaUsuarios = await listar_usuarios();
    res.status(200).json(listaUsuarios);
  } catch (err) {
    console.error("Erro listando usuarios: ", err);
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar usuarios!", error: err.message });
  }
};

const criar_usuarioController = async (req, res) => {
  try {
    const {
      nome,
      email,
      cpf,
      RE,
      senha,
      contato,
      sexo,
      cargo,
      vinculo,
      loja_vinculada,
    } = req.body;

    console.log(req.body)

    const senhaHasheada = await generateHashedPassword(senha)

    const data = {
      nome: nome,
      email: email,
      cpf: cpf,
      RE: RE,
      senha: senhaHasheada,
      contato: contato,
      sexo: sexo,
      cargo: cargo,
      vinculo: vinculo,
      loja_vinculada: loja_vinculada,
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
    const {id} = req.params;
    const { nome, cpf, contato, sexo, cargo, vinculo, loja_vinculada } =
      req.body;
    const data = {
      nome: nome,
      cpf: cpf,
      contato: contato,
      sexo: sexo,
      cargo: cargo,
      vinculo: vinculo,
      loja_vinculada: loja_vinculada,
    };
    console.log(id, data)
    const atualizaUsuario = await update_usuario(id, data);
    return res.status(200).json({
      mensagem: "Usuário atualizado com sucesso!",
      affectedRows: atualizaUsuario.affectedRows,
    });
  } catch (err) {
    console.error("Erro ao atualizar usuario: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar usuario!", erro: err });
  }
};
const delete_usuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUsuario = await delete_usuario(id);
    return res.status(200).json({ deleteUsuario });
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
