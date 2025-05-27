import { Router } from "express";
import { AISuggestionController } from "../controllers/AISuggestionController";

const router = Router();

router.get("/", AISuggestionController.getAll);
router.get("/:id", AISuggestionController.getById);
router.post("/", AISuggestionController.create);
router.put("/:id", AISuggestionController.update);
router.delete("/:id", AISuggestionController.remove);

export default router;
