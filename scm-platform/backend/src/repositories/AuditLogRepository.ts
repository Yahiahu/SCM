// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { AuditLog } from "../entities/AuditLog";

export const AuditLogRepository: Repository<AuditLog> =
  AppDataSource.getRepository(AuditLog);
