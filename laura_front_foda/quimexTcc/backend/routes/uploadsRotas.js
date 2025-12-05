import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// pasta de uploads
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "chat");

// garante que a pasta exista
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ts = Date.now();
    // mantemos ext original
    const ext = path.extname(file.originalname) || "";
    const name = `${ts}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max (ajuste se quiser)
});

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado" });

    const file = req.file;
    // URL pública (assumindo que o servidor serve /uploads como static)
    const url = `${req.protocol}://${req.get("host")}/uploads/chat/${file.filename}`;

    return res.json({
      success: true,
      url,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
  } catch (err) {
    console.error("Erro upload:", err);
    return res.status(500).json({ error: "Erro ao salvar arquivo" });
  }
});

export default router;