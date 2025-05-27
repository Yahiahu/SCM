// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { ChatMessage } from "../entities/ChatMessage";

export const ChatMessageRepository: Repository<ChatMessage> =
  AppDataSource.getRepository(ChatMessage);
