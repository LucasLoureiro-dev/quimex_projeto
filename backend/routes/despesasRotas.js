import { listar_despesas, criar_despesa, atualizar_despesa, excluir_despesa }  from "../controllers/despesasController.js";
import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_controleDiarioController);
router.post("/", criar_controleDiarioController);

export default router;