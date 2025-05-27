// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { ShippingInfo } from "../entities/ShippingInfo";

export const ShippingInfoRepository: Repository<ShippingInfo> =
  AppDataSource.getRepository(ShippingInfo);
