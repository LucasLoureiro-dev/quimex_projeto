import {
  listar_estoqueController,
  criar_estoqueController,
  atualizar_estoqueController,
  excluir_estoqueController,
} from "../controllers/estoqueController.js";

import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_estoqueController);
router.post("/", criar_estoqueController);
router.put("/:id", atualizar_estoqueController);
router.delete("/:id", excluir_estoqueController);

export default router;
