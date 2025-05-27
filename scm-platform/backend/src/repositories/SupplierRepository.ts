// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Supplier } from "../entities/Supplier";

export const SupplierRepository: Repository<Supplier> =
  AppDataSource.getRepository(Supplier);
