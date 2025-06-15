import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
import { AppDataSource } from "./data-source";
console.log("🔥 Bootstrapping server...");

import routes from "./routes";


dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api", routes);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data source initialized");
    const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
  })
  .catch((err) => {
    console.error("❌ Failed to initialize DB:", err);
  });
