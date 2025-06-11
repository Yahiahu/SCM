// src/routes/finance.routes.ts
import { Router } from "express";
import {
  getFinancialSummary,
  getCashFlow,
} from "../../controllers/new/financialsController";
const router = Router();

router.get("/summary", getFinancialSummary);
router.get("/cash-flow", getCashFlow);

export default router;
