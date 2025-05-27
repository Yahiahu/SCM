// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { SupplierQuote } from "../entities/SupplierQuote";

export const SupplierQuoteRepository: Repository<SupplierQuote> =
  AppDataSource.getRepository(SupplierQuote);
