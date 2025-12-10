import { loginController } from "../controllers/authController.js";
import express, { Router } from "express";

const router = express.Router();

router.post('/', loginController);

router.post('/logout', (req, res) => {



  req.session.destroy((destroyErr) => {
    if (destroyErr) {
      console.error('Erro ao destruir sessão:', destroyErr);
      return res.status(500).json({ error: 'Erro ao encerrar sessão' });
    }

    res.clearCookie('connect.sid'); // Remove o cookie de sessão
    res.json({ message: 'Logout realizado com sucesso' });
  });
});

export default router;