import { Router } from "express";
import { PurchaseOrderController } from "../controllers/PurchaseOrderController";

const router = Router();

// Add this line BEFORE `/:id` route to avoid route shadowing
router.get("/:id/activities", PurchaseOrderController.getActivities);

router.get("/", PurchaseOrderController.getAll);
router.get("/:id", PurchaseOrderController.getById);
router.post("/", PurchaseOrderController.create);
router.put("/:id", PurchaseOrderController.update);
router.delete("/:id", PurchaseOrderController.remove);

export default router;
