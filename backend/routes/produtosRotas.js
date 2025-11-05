import {
  listar_produtosController,
  criar_produtoController,
  atualizar_produtoController,
  excluir_produtoController,
} from "../controllers/produtosController.js";

import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_produtosController);
router.post("/", criar_produtoController);
router.put("/:id", atualizar_produtoController);
router.delete("/:id", excluir_produtoController);

export default router;
