// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Component } from "../entities/Component";

export const ComponentRepository: Repository<Component> =
  AppDataSource.getRepository(Component);
