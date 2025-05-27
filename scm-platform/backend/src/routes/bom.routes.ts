import { Router } from "express";
import { BOMController } from "../controllers/BOMController";

const router = Router();

router.get("/", BOMController.getAll);
router.get("/:id", BOMController.getById);
router.post("/", BOMController.create);
router.put("/:id", BOMController.update);
router.delete("/:id", BOMController.remove);

export default router;
