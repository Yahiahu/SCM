// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Warehouse } from "../entities/Warehouse";

export const WarehouseRepository: Repository<Warehouse> =
  AppDataSource.getRepository(Warehouse);
