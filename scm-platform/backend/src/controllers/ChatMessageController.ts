import { Request, Response, RequestHandler } from "express";
import { ChatMessageRepository } from "../repositories/ChatMessageRepository";
import { UserRepository } from "../repositories/UserRepository";
import { PurchaseOrderRepository } from "../repositories/PurchaseOrderRepository";
import { POConversationThread } from "../entities/POConversationThread";
import { AppDataSource } from "../data-source";
import { ChatMessage } from "../entities";

export const ChatMessageController = {
  getAll: (async (req: Request, res: Response) => {
    const messages = await ChatMessageRepository.find({
      relations: ["sender", "receiver", "po", "thread", "attachments"],
      order: { timestamp: "DESC" },
    });
    res.json(messages);
  }) as RequestHandler,

  getByThreadId: (async (req: Request, res: Response) => {
    const threadId = parseInt(req.query.threadId as string);
    if (isNaN(threadId)) {
      return res.status(400).json({ message: "Invalid threadId" });
    }

    try {
      const repo = AppDataSource.getRepository(ChatMessage);
      const messages = await repo.find({
        where: { threadId },
        relations: ["sender", "receiver", "attachments"],
        order: { timestamp: "DESC" },
      });
      res.json(messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const message = await ChatMessageRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["sender", "receiver", "po", "thread", "attachments"],
    });
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { sender_id, receiver_id, po_id, thread_id, message_body } = req.body;

    const sender = await UserRepository.findOne({ where: { id: sender_id } });
    if (!sender) return res.status(400).json({ message: "Invalid sender_id" });

    const receiver = receiver_id
      ? await UserRepository.findOne({ where: { id: receiver_id } })
      : null;

    const po = po_id
      ? await PurchaseOrderRepository.findOne({ where: { id: po_id } })
      : null;

    const thread = await AppDataSource.getRepository(
      POConversationThread
    ).findOne({
      where: { id: thread_id },
    });
    if (!thread) return res.status(400).json({ message: "Invalid thread_id" });

    const newMessage = ChatMessageRepository.create({
      sender,
      receiver: receiver ?? undefined,
      po: po ?? undefined,
      thread,
      threadId: thread.id,
      message_body,
    });

    const saved = await ChatMessageRepository.save(newMessage);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { sender_id, receiver_id, po_id, message_body } = req.body;

    const message = await ChatMessageRepository.findOne({
      where: { id },
      relations: ["sender", "receiver", "po", "thread"],
    });
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (sender_id) {
      const sender = await UserRepository.findOne({ where: { id: sender_id } });
      if (!sender)
        return res.status(400).json({ message: "Invalid sender_id" });
      message.sender = sender;
    }

    if (receiver_id !== undefined) {
      const receiver = await UserRepository.findOne({
        where: { id: receiver_id },
      });
      message.receiver = receiver ?? null;
    }

    if (po_id !== undefined) {
      const po = await PurchaseOrderRepository.findOne({
        where: { id: po_id },
      });
      message.po = po ?? null;
    }

    message.message_body = message_body ?? message.message_body;

    const updated = await ChatMessageRepository.save(message);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const message = await ChatMessageRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!message) return res.status(404).json({ message: "Message not found" });

    await ChatMessageRepository.remove(message);
    res.status(204).send();
  }) as RequestHandler,
};
