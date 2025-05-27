import { Router } from "express";
import { ProductDemandController } from "../controllers/ProductDemandController";

const router = Router();

router.get("/", ProductDemandController.getAll);
router.get("/:id", ProductDemandController.getById);
router.post("/", ProductDemandController.create);
router.put("/:id", ProductDemandController.update);
router.delete("/:id", ProductDemandController.remove);

export default router;
