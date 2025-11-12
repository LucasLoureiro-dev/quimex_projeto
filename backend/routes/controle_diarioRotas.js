import { listar_controleDiarioController, criar_controleDiarioController }  from "../controllers/controle_diario.js";

import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_controleDiarioController);
router.post("/", criar_controleDiarioController);

export default router;