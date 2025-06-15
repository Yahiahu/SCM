import { Router } from "express";
import { ShippingInfoController } from "../controllers/ShippingInfoController";

const router = Router();

router.get("/:id/history", ShippingInfoController.getHistory);
router.get("/:id/events", ShippingInfoController.getEvents);

router.get("/", ShippingInfoController.getAll);
router.get("/:id", ShippingInfoController.getById);
router.post("/", ShippingInfoController.create);
router.put("/:id", ShippingInfoController.update);
router.delete("/:id", ShippingInfoController.remove);

router.get("/:id/history", ShippingInfoController.getHistory);
router.get("/:id/events", ShippingInfoController.getEvents);

export default router;
