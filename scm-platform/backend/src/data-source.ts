import { DataSource } from "typeorm";
import dotenv from "dotenv";
import * as Entities from "./entities"; // ⬅️ Import all from your new index.ts

dotenv.config();

console.log("⚙️  Creating AppDataSource...");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "postgres",
  synchronize: true,
  logging: true,
  entities: Object.values(Entities), // ⬅️ Load all entities dynamically
});

console.log("✅ data-source.ts loaded");
