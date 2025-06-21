import { Router } from "express";
import { AppDataSource } from "../data-source"; // or however you connect to DB

const router = Router();

router.get("/ping", async (req, res) => {
  try {
    const result = await AppDataSource.query("SELECT 1");
    res.status(200).json({ message: "pong", db: result });
  } catch (err) {
    console.error("❌ DB Ping Error", err);
    res.status(500).json({ error: "Database ping failed" });
  }
});

export default router;
