// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { ProductDemand } from "../entities/ProductDemand";

export const ProductDemandRepository: Repository<ProductDemand> =
  AppDataSource.getRepository(ProductDemand);
