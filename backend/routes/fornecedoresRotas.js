import {
  listar_fornecedoresController,
  criar_fornecedorCotnroller,
  atualizar_fornecedorController,
  excluir_fornecedoresController,
} from "../controllers/fornecedoresController.js";

import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_fornecedoresController);
router.post("/", criar_fornecedorCotnroller);
router.put("/:id", atualizar_fornecedorController);
router.delete("/:id", excluir_fornecedoresController);

export default router;
