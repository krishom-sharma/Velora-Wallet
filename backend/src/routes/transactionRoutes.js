import { Router } from "express";
import {
  generateQr,
  getTransactions,
  payRequest,
  processQrPayment,
  requestMoney,
  sendMoney
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  payRequestValidator,
  qrPaymentValidator,
  requestMoneyValidator,
  sendMoneyValidator,
  transactionListValidator
} from "../validators/transactionValidators.js";

const router = Router();

router.use(protect);
router.get("/", transactionListValidator, validateRequest, getTransactions);
router.post("/send", sendMoneyValidator, validateRequest, sendMoney);
router.post("/request", requestMoneyValidator, validateRequest, requestMoney);
router.post("/requests/:id/pay", payRequestValidator, validateRequest, payRequest);
router.post("/qr/generate", generateQr);
router.post("/qr/process", qrPaymentValidator, validateRequest, processQrPayment);

export default router;
