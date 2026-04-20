import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { profileValidator } from "../validators/profileValidators.js";

const router = Router();

router.use(protect);
router.get("/", getProfile);
router.patch("/", upload.single("avatar"), profileValidator, validateRequest, updateProfile);

export default router;
