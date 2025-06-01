// src/routes/automationRule.routes.ts
import { Router } from "express";
import { AutomationRuleController } from "../../controllers/new/AutomationRuleController";

const router = Router();

router.get("/", AutomationRuleController.getAll);
router.get("/:id", AutomationRuleController.getById);
router.post("/", AutomationRuleController.create);
router.put("/:id", AutomationRuleController.update);
router.delete("/:id", AutomationRuleController.delete);

export default router;
