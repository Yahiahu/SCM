// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { MonthlyStock } from "../entities/MonthlyStock";

export const MonthlyStockRepository: Repository<MonthlyStock> =
  AppDataSource.getRepository(MonthlyStock);
