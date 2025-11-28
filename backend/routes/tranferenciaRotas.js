import { listar_transferenciasController, criar_transferenciaController, atualizar_transferenciaController, excluir_transferenciasController } from "../controllers/transferenciasController.js";
import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_transferenciasController);
router.post("/", criar_transferenciaController);
router.put("/:id", atualizar_transferenciaController);
router.delete("/:id", excluir_transferenciasController);

export default router;
