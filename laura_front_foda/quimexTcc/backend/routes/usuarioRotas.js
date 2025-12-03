import { listar_usuariosController, criar_usuarioController, update_usuarioController, delete_usuarioController } from "../controllers/usuariosController.js";

import express, { Router } from "express"

const router = express.Router()

router.get("/", listar_usuariosController)
router.post("/", criar_usuarioController)

export default router;