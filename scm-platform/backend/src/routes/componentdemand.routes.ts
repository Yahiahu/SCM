import { Router } from "express";
import { ComponentDemandController } from "../controllers/ComponentDemandController";

const router = Router();

router.get("/", ComponentDemandController.getAll);
router.get("/:id", ComponentDemandController.getById);
router.post("/", ComponentDemandController.create);
router.put("/:id", ComponentDemandController.update);
router.delete("/:id", ComponentDemandController.remove);

export default router;
