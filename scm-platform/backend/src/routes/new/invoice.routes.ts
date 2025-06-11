// src/routes/invoice.routes.ts
import { Router } from "express";
import {
  createInvoice,
  getAllInvoices,
} from "../../controllers/new/invoiceController";
const router = Router();

router.get("/", getAllInvoices);
router.post("/", createInvoice);

export default router;