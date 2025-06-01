// src/routes/inventoryAudit.routes.ts
import { Router } from "express";
import { InventoryAuditController } from "../../controllers/new/InventoryAuditController";

const router = Router();

router.get("/", InventoryAuditController.getAll);
router.get("/:id", InventoryAuditController.getById);
router.post("/", InventoryAuditController.create);
router.put("/:id", InventoryAuditController.update);
router.delete("/:id", InventoryAuditController.delete);

export default router;
