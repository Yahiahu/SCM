// src/routes/inventoryValuation.routes.ts
import { Router } from "express";
import { InventoryValuationController } from "../../controllers/new/InventoryValuationController";

const router = Router();

router.get("/", InventoryValuationController.getAll);
router.get("/:id", InventoryValuationController.getById);
router.post("/", InventoryValuationController.create);
router.put("/:id", InventoryValuationController.update);
router.delete("/:id", InventoryValuationController.delete);

export default router;
