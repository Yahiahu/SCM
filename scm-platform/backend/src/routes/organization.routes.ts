import { Router } from "express";
import { OrganizationController } from "../controllers/OrganizationController";

const router = Router();

router.get("/", OrganizationController.getAll);
router.get("/:id", OrganizationController.getById);
router.post("/", OrganizationController.create);
router.put("/:id", OrganizationController.update);
router.delete("/:id", OrganizationController.remove);

export default router;
