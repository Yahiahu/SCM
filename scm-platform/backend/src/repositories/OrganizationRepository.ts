// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Organization } from "../entities/Organization";

export const OrganizationRepository: Repository<Organization> =
  AppDataSource.getRepository(Organization);
