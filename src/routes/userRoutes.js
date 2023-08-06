import express from "express";
import { login, register } from "../controllers/userController.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

router.post("/register", validateUser, register);
router.post("/login", validateUser, login);

export default router;
