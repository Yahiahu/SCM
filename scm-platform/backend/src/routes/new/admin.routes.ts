// admin.routes.ts
import express from "express";
import { getDashboardSummary } from "../../controllers/new/AdminController";

const router = express.Router();

router.get("/dashboard-summary", getDashboardSummary);

export default router;
