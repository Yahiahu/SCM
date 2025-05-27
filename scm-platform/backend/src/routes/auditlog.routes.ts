import { Router } from "express";
import { AuditLogController } from "../controllers/AuditLogController";

const router = Router();

router.get("/", AuditLogController.getAll);
router.get("/:id", AuditLogController.getById);
router.post("/", AuditLogController.create);
router.put("/:id", AuditLogController.update);
router.delete("/:id", AuditLogController.remove);

export default router;
