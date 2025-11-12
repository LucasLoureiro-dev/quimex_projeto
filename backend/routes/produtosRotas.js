import {
  listar_produtosController,
  criar_produtoController,
  atualizar_produtoController,
  excluir_produtoController,
} from "../controllers/produtosController.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const nomeArquivo = `${Date.now()}-${file.originalname}`;
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage: storage });

import express, { Router } from "express";

const router = express.Router();

router.get("/", listar_produtosController);
router.post("/", criar_produtoController);
router.put("/:id",  upload.single('imagem'), atualizar_produtoController);
router.delete("/:id", excluir_produtoController);

export default router;
