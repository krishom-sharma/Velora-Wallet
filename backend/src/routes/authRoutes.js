import { Router } from "express";
import { csrfToken, login, logout, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

router.get("/csrf-token", csrfToken);
router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
