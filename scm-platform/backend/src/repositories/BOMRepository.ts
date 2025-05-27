// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { BOM } from "../entities/BOM";

export const BOMRepository: Repository<BOM> =
  AppDataSource.getRepository(BOM);
