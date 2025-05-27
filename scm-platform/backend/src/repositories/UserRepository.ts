// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { User } from "../entities/User";

export const UserRepository: Repository<User> =
  AppDataSource.getRepository(User);
