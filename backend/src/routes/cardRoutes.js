import { Router } from "express";
import { addCard, deleteCard, getCards } from "../controllers/cardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addCardValidator, cardIdValidator } from "../validators/cardValidators.js";

const router = Router();

router.use(protect);
router.get("/", getCards);
router.post("/", addCardValidator, validateRequest, addCard);
router.delete("/:id", cardIdValidator, validateRequest, deleteCard);

export default router;
