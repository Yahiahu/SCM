// src/routes/rfq.routes.ts
import { Router } from "express";
import { RFQController } from "../../controllers/new/RFQController";

const router = Router();

router.get("/", RFQController.getAll);
router.get("/:id", RFQController.getById);
router.post("/", RFQController.create);
router.put("/:id", RFQController.update);
router.delete("/:id", RFQController.delete);

export default router;
