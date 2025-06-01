// src/routes/anomaly.routes.ts
import { Router } from "express";
import { AnomalyController } from "../../controllers/new/AnomolyLogController";

const router = Router();

router.get("/", AnomalyController.getAll);
router.get("/:id", AnomalyController.getById);
router.post("/", AnomalyController.create);
router.put("/:id", AnomalyController.update);
router.delete("/:id", AnomalyController.delete);

export default router;
