import { dashboardController } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import express from "express";

const router = express.Router();

router.get("/", authMiddleware, dashboardController);

export default router;