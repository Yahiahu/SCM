// src/routes/alert.routes.ts
import { Router } from "express";
import { AlertController } from "../../controllers/new/AlertController";

const router = Router();

router.get("/", AlertController.getAll);
router.get("/:id", AlertController.getById);
router.post("/", AlertController.create);
router.patch("/:id/mark-read", AlertController.markRead);
router.put("/:id", AlertController.update);
router.delete("/:id", AlertController.delete);

export default router;
