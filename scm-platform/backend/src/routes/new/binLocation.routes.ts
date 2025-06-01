// src/routes/binLocation.routes.ts
import { Router } from "express";
import { BinLocationController } from "../../controllers/new/BinLocationController";

const router = Router();

router.get("/", BinLocationController.getAll);
router.get("/:id", BinLocationController.getById);
router.post("/", BinLocationController.create);
router.put("/:id", BinLocationController.update);
router.delete("/:id", BinLocationController.delete);

export default router;
