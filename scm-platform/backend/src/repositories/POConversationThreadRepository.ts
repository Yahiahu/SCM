// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { POConversationThread } from "../entities/POConversationThread";

export const POConversationThreadRepository: Repository<POConversationThread> =
  AppDataSource.getRepository(POConversationThread);
