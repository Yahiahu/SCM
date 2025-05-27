import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";

const router = Router();

router.get("/", SupplierController.getAll);
router.get("/:id", SupplierController.getById);
router.post("/", SupplierController.create);
router.put("/:id", SupplierController.update);
router.delete("/:id", SupplierController.remove);

export default router;
