// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Product } from "../entities/Product";

export const ProductRepository: Repository<Product> =
  AppDataSource.getRepository(Product);
