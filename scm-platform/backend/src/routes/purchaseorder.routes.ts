import { Router } from "express";
import { PurchaseOrderController } from "../controllers/PurchaseOrderController";

const router = Router();

router.get("/", PurchaseOrderController.getAll);
router.get("/:id", PurchaseOrderController.getById);
router.post("/", PurchaseOrderController.create);
router.put("/:id", PurchaseOrderController.update);
router.delete("/:id", PurchaseOrderController.remove);

export default router;
