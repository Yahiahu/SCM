// src/routes/goal.routes.ts
import { Router } from "express";
import { GoalController } from "../../controllers/new/GoalController";

const router = Router();

router.get("/", GoalController.getAll);
router.get("/:id", GoalController.getById);
router.post("/", GoalController.create);
router.put("/:id", GoalController.update);
router.delete("/:id", GoalController.delete);

export default router;
