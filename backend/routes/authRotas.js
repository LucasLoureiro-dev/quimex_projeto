import { loginController } from "../controllers/authController.js";
import express, { Router } from "express";

const router = express.Router();

router.post('/', loginController);

export default router;