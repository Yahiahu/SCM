// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { WarehouseInventory } from "../entities/WarehouseInventory";

export const WarehouseInventoryRepository: Repository<WarehouseInventory> =
  AppDataSource.getRepository(WarehouseInventory);
