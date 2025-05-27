import { Router } from "express";
import { MessageAttachmentController } from "../controllers/MessageAttachmentController";

const router = Router();

router.get("/", MessageAttachmentController.getAll);
router.get("/:id", MessageAttachmentController.getById);
router.post("/", MessageAttachmentController.create);
router.put("/:id", MessageAttachmentController.update);
router.delete("/:id", MessageAttachmentController.remove);

export default router;
