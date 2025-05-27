import { Router } from "express";
import { SupplierQuoteController } from "../controllers/SupplierQuoteController";

const router = Router();

router.get("/", SupplierQuoteController.getAll);
router.get("/:id", SupplierQuoteController.getById);
router.post("/", SupplierQuoteController.create);
router.put("/:id", SupplierQuoteController.update);
router.delete("/:id", SupplierQuoteController.remove);

export default router;
