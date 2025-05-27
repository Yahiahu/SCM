// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { POItem } from "../entities/POItem";

export const POItemRepository: Repository<POItem> =
  AppDataSource.getRepository(POItem);
