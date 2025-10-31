import {
 listar_lojasController, criar_lojaController, atualizar_lojaController,  excluir_lojaController
} from "../controllers/lojasController.js";
import express, { Router } from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get('/', listar_lojasController);

router.post('/', adminMiddleware, criar_lojaController);

router.put('/:id', adminMiddleware, atualizar_lojaController);

router.delete('/:id', adminMiddleware, excluir_lojaController);

export default router;
