import { Router } from "express";
import { WarehouseLayoutController } from "../controllers/WarehouseLayoutController";

const router = Router();

router.get("/", WarehouseLayoutController.getAll);
router.get("/:id", WarehouseLayoutController.getById);
router.post("/", WarehouseLayoutController.create);
router.put("/:id", WarehouseLayoutController.update);
router.delete("/:id", WarehouseLayoutController.remove);

export default router;
