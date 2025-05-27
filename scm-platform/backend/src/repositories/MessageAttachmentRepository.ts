// src/repositories/AISuggestionRepository.ts
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { MessageAttachment } from "../entities/MessageAttachment";

export const MessageAttachmentRepository: Repository<MessageAttachment> =
  AppDataSource.getRepository(MessageAttachment);
