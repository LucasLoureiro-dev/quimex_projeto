import {
  listar_usuarios
} from "../models/Usuarios.js";

const dashboardController = async (req, res) => {
  try {
    const listaUsuarios = await listar_usuarios();
    const usuario = await listaUsuarios.find((i) => i.id == req.session.usuario);
    res.status(200).json({
      id: usuario.id,
      usuario: usuario.nome,
      cargo: usuario.cargo,
      RE: usuario.RE,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
};

export { dashboardController };
