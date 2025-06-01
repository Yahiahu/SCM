// src/routes/inventoryTransaction.routes.ts
import { Router } from "express";
import { InventoryTransactionController } from "../../controllers/new/InventoryTransactionController";

const router = Router();

router.get("/", InventoryTransactionController.getAll);
router.get("/:id", InventoryTransactionController.getById);
router.post("/", InventoryTransactionController.create);
router.put("/:id", InventoryTransactionController.update);
router.delete("/:id", InventoryTransactionController.delete);

export default router;
