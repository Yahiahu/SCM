// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { WarehouseLayout } from "../entities/WarehouseLayout";

export const WarehouseLayoutRepository: Repository<WarehouseLayout> =
  AppDataSource.getRepository(WarehouseLayout);
