import { Router } from "express";
import { MonthlyStockController } from "../controllers/MonthlyStockController";

const router = Router();

router.get("/", MonthlyStockController.getAll);
router.get("/:id", MonthlyStockController.getById);
router.post("/", MonthlyStockController.create);
router.put("/:id", MonthlyStockController.update);
router.delete("/:id", MonthlyStockController.remove);

export default router;
