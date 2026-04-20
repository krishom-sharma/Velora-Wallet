import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { settingsValidator } from "../validators/settingsValidators.js";

const router = Router();

router.use(protect);
router.get("/", getSettings);
router.patch("/", settingsValidator, validateRequest, updateSettings);

export default router;
