// src/routes/returnOrder.routes.ts
import { Router } from "express";
import { ReturnOrderController } from "../../controllers/new/ReturnorderController";

const router = Router();

router.get("/", ReturnOrderController.getAll);
router.get("/:id", ReturnOrderController.getById);
router.post("/", ReturnOrderController.create);
router.put("/:id", ReturnOrderController.update);
router.delete("/:id", ReturnOrderController.delete);

export default router;
