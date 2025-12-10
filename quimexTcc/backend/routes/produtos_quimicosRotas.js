import {
  listar_produtos_quimicosController,
  criar_produto_quimicosController,
  atualizar_produto_quimicosController,
  excluir_produto_quimicosController,
} from "../controllers/produtos_quimicosController.js";

import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_produtos_quimicosController);
router.post("/", criar_produto_quimicosController);
router.put("/:id", atualizar_produto_quimicosController);
router.delete("/:id", excluir_produto_quimicosController);

export default router;
