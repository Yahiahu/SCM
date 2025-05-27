import { Router } from "express";
import { POItemController } from "../controllers/POItemController";

const router = Router();

router.get("/", POItemController.getAll);
router.get("/:id", POItemController.getById);
router.post("/", POItemController.create);
router.put("/:id", POItemController.update);
router.delete("/:id", POItemController.remove);

export default router;
