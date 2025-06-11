// src/routes/payment.routes.ts
import { Router } from "express";
import {
  createPayment,
  getAllPayments,
} from "../../controllers/new/paymentController";
const router = Router();

router.get("/", getAllPayments);
router.post("/", createPayment);

export default router;
