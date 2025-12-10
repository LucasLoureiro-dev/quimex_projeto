import { dashboardController } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import express from "express";

const router = express.Router();

router.get("/", authMiddleware, dashboardController);

router.get("/caixa", (req, res) => {
    try {
        req.session.caixa = req.body.valor;
        res.status(200).json({ valor: req.session.caixa  });
    }
    catch (err) {
        console.error("Erro buscando valor do caixa:", err);
        res.status(500).json({ message: "Erro ao buscar valor do caixa", error: err.message });
    }
});

router.post("/caixa", (req, res) => {
    try {
        req.session.caixa = req.body.valor;
        res.status(200).json({ valor: req.session.caixa  });
    }
    catch (err) {
        console.error("Erro abrindo o caixa:", err);
        res.status(500).json({ message: "Erro ao abrir o caixa", error: err.message });
    }
});

export default router;