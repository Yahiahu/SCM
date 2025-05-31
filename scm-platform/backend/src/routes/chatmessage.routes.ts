import { Router } from "express";
import { ChatMessageController } from "../controllers/ChatMessageController";

const router = Router();

router.get("/", ChatMessageController.getByThreadId); // supports ?threadId
router.get("/:id", ChatMessageController.getById);
router.post("/", ChatMessageController.create);
router.put("/:id", ChatMessageController.update);
router.delete("/:id", ChatMessageController.remove);

export default router;
