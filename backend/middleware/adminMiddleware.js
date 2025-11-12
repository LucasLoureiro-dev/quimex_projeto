import { listar_usuarios } from "../models/Usuarios.js";

const authMiddleware = async (req, res, next) => {
  if (!req.session.usuario) {
    return res
      .status(401)
      .json({ mensagem: "Não autorizado: Usuário não logado" });
  }
  try {
    const listaUsuarios = await listar_usuarios();
    const usuario = await listaUsuarios.find(
      (i) => i.id == req.session.usuario
    );
    if (usuario.cargo != "Administrador" && usuario.cargo != "Gerente") {
      return res
        .status(403)
        .json({ mensagem: "Proibido: Acesso restrito a administradores" });
    }
    else{
          next();
    }
  } catch (err) {
    return res.status(401).json({ mensagem: "Não autorizado: Token inválido" });
  }
};

export default authMiddleware;
