// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { CycleCount } from "../entities/new/CycleCount";

export const CycleCountRepository: Repository<CycleCount> =
  AppDataSource.getRepository(CycleCount);
