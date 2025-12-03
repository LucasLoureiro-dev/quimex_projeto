import { read, compare } from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js"; // Importar a chave secreta

const loginController = async (req, res) => {
  try {
    const { RE, senha } = req.body;
    // Verificar se o usuário existe no banco de dados
    const usuario = await read("usuarios", ` RE = '${RE}'`);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Verificar se a senha está correta (comparar a senha enviada com o hash armazenado)
    const senhaCorreta = await compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    req.session.usuario = {
      "Id": usuario.id,
      "Nome": usuario.nome,
      "Cargo": usuario.cargo,
      "RE": usuario.RE
    };
    res.json({ mensagem: "Login realizado com sucesso", cargo: usuario.cargo, nome: usuario.nome});
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
};

export { loginController };
