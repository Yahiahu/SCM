// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { PurchaseOrder } from "../entities/PurchaseOrder";

export const PurchaseOrderRepository: Repository<PurchaseOrder> =
  AppDataSource.getRepository(PurchaseOrder);
