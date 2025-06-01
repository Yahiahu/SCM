// src/routes/inventoryBatch.routes.ts
import { Router } from "express";
import { InventoryBatchController } from "../../controllers/new/InvenotryBatchController";

const router = Router();

router.get("/", InventoryBatchController.getAll);
router.get("/:id", InventoryBatchController.getById);
router.post("/", InventoryBatchController.create);
router.put("/:id", InventoryBatchController.update);
router.delete("/:id", InventoryBatchController.delete);

export default router;
