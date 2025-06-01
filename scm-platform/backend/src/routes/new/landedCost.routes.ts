// src/routes/landedCost.routes.ts
import { Router } from "express";
import { LandedCostController } from "../../controllers/new/LandedCostController";

const router = Router();

router.get("/", LandedCostController.getAll);
router.get("/:id", LandedCostController.getById);
router.post("/", LandedCostController.create);
router.put("/:id", LandedCostController.update);
router.delete("/:id", LandedCostController.delete);

export default router;
