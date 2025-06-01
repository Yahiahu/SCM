// src/routes/riskprediction.routes.ts
import { Router } from "express";
import { RiskPredictionController } from "../../controllers/new/RiskPredictionController";

const router = Router();

router.get("/", RiskPredictionController.getAll);
router.get("/:id", RiskPredictionController.getById);
router.post("/", RiskPredictionController.create);
router.put("/:id", RiskPredictionController.update);
router.delete("/:id", RiskPredictionController.delete);

export default router;
