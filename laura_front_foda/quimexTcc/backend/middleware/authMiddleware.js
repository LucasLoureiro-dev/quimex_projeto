import jwt, { decode } from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

const authMiddleware = (req, res, next) => {

    console.log(req.session.usuario);

    if (!req.session.usuario) {
        return res.status(401).json({ mensagem: 'Não autorizado: Usuário não logado' })
    }

    try {
        next()
    } catch (err) {
        return res.status(401).json({ mensagem: 'Não autorizado: Token inválido' });
    }
}

export default authMiddleware