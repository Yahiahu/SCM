import { Router } from "express";
import { WarehouseInventoryController } from "../controllers/WarehouseInventoryController";

const router = Router();

router.get("/", WarehouseInventoryController.getAll);
router.get("/:id", WarehouseInventoryController.getById);
router.post("/", WarehouseInventoryController.create);
router.put("/:id", WarehouseInventoryController.update);
router.delete("/:id", WarehouseInventoryController.remove);

export default router;
