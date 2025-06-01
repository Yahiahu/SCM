// src/routes/supplierscore.routes.ts
import { Router } from "express";
import { SupplierScoreController } from "../../controllers/new/SupplierScoreController";

const router = Router();

router.get("/", SupplierScoreController.getAll);
router.get("/:id", SupplierScoreController.getById);
router.post("/", SupplierScoreController.create);
router.put("/:id", SupplierScoreController.update);
router.delete("/:id", SupplierScoreController.delete);

export default router;
