import { listar_contasController, criar_contaController, atualizar_contasController, excluir_contasController } from "../controllers/contasControler.js";
import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_contasController);
router.post("/", criar_contaController);
router.put("/:id", atualizar_contasController);
router.delete("/:id", excluir_contasController);

export default router;
