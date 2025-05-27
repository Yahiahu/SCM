// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { AISuggestion } from "../entities/AISuggestion";
import { Repository } from "typeorm";

export const AISuggestionRepository: Repository<AISuggestion> =
  AppDataSource.getRepository(AISuggestion);
