import { Request, Response, RequestHandler } from "express";
import { ChatMessageRepository } from "../repositories/ChatMessageRepository";
import { UserRepository } from "../repositories/UserRepository";
import { PurchaseOrderRepository } from "../repositories/PurchaseOrderRepository";

export const ChatMessageController = {
  getAll: (async (req: Request, res: Response) => {
    const messages = await ChatMessageRepository.find({
      relations: ["sender", "receiver", "po", "attachments"],
      order: { timestamp: "DESC" },
    });
    res.json(messages);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const message = await ChatMessageRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["sender", "receiver", "po", "attachments"],
    });
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { sender_id, receiver_id, po_id, message_body } = req.body;

    const sender = await UserRepository.findOne({ where: { id: sender_id } });
    if (!sender) return res.status(400).json({ message: "Invalid sender_id" });

    const receiver = receiver_id
      ? await UserRepository.findOne({ where: { id: receiver_id } })
      : null;

    const po = po_id
      ? await PurchaseOrderRepository.findOne({ where: { id: po_id } })
      : null;

    const newMessage = ChatMessageRepository.create({
      sender,
      receiver: receiver ?? undefined,
      po: po ?? undefined,
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
      relations: ["sender", "receiver", "po"],
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
