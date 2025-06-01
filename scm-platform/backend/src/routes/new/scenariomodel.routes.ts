// src/routes/scenariomodel.routes.ts
import { Router } from "express";
import { ScenarioModelController } from "../../controllers/new/ScenarioModelController";

const router = Router();

router.get("/", ScenarioModelController.getAll);
router.get("/:id", ScenarioModelController.getById);
router.post("/", ScenarioModelController.create);
router.put("/:id", ScenarioModelController.update);
router.delete("/:id", ScenarioModelController.delete);

export default router;
