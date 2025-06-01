// src/routes/purchaseGroup.routes.ts
import { Router } from "express";
import { PurchaseGroupController } from "../../controllers/new/PurchaseGroupController";

const router = Router();

router.get("/", PurchaseGroupController.getAll);
router.get("/:id", PurchaseGroupController.getById);
router.post("/", PurchaseGroupController.create);
router.put("/:id", PurchaseGroupController.update);
router.delete("/:id", PurchaseGroupController.delete);

export default router;
