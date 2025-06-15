import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";

const router = Router();

router.get("/", SupplierController.getAll);
router.get("/:id", SupplierController.getById);
router.post("/", SupplierController.create);
router.put("/:id", SupplierController.update);
router.delete("/:id", SupplierController.remove);

router.get("/:id/components", SupplierController.getComponentsBySupplier);
router.get("/:id/purchaseorders", SupplierController.getPurchaseOrdersBySupplier);
router.get("/:id/performance", SupplierController.getPerformanceBySupplier);

export default router;
