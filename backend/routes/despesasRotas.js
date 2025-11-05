import {
  listar_despesasController,
  criar_despesaController,
  atualizar_despesasController,
  excluir_despesasController,
} from "../controllers/despesasController.js";
import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_despesasController);
router.post("/", criar_despesaController);
router.put("/:id", atualizar_despesasController);
router.delete("/:id", excluir_despesasController);

export default router;
