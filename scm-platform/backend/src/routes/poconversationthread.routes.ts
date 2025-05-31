import { Router } from "express";
import { POConversationThreadController } from "../controllers/POConversationThreadController";

const router = Router();

router.get("/", POConversationThreadController.getAll);

export default router;
