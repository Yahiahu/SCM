// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { ComponentDemand } from "../entities/ComponentDemand";

export const ComponentDemandRepository: Repository<ComponentDemand> =
  AppDataSource.getRepository(ComponentDemand);
