import {
 listar_lojasController, criar_lojaController, atualizar_lojaController,  excluir_lojaController
} from "../controllers/lojasController.js";
import express, { Router } from "express";

const router = express.Router();

router.get('/', listar_lojasController);

router.post('/', criar_lojaController);

router.put('/:id', atualizar_lojaController);

router.delete('/:id', excluir_lojaController);

export default router;
