import { Request, Response, RequestHandler } from "express";
import { MessageAttachmentRepository } from "../repositories/MessageAttachmentRepository";
import { ChatMessageRepository } from "../repositories/ChatMessageRepository";

export const MessageAttachmentController = {
  getAll: (async (req: Request, res: Response) => {
    const attachments = await MessageAttachmentRepository.find({
      relations: ["message"],
    });
    res.json(attachments);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const attachment = await MessageAttachmentRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["message"],
    });
    if (!attachment)
      return res.status(404).json({ message: "Attachment not found" });
    res.json(attachment);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { message_id, file_url, file_type } = req.body;

    const message = await ChatMessageRepository.findOne({
      where: { id: message_id },
    });
    if (!message)
      return res.status(400).json({ message: "Invalid message_id" });

    const attachment = MessageAttachmentRepository.create({
      message,
      file_url,
      file_type,
    });

    const saved = await MessageAttachmentRepository.save(attachment);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { file_url, file_type, message_id } = req.body;

    const attachment = await MessageAttachmentRepository.findOne({
      where: { id },
      relations: ["message"],
    });

    if (!attachment)
      return res.status(404).json({ message: "Attachment not found" });

    attachment.file_url = file_url ?? attachment.file_url;
    attachment.file_type = file_type ?? attachment.file_type;

    if (message_id !== undefined) {
      const message = await ChatMessageRepository.findOne({
        where: { id: message_id },
      });
      if (!message)
        return res.status(400).json({ message: "Invalid message_id" });
      attachment.message = message;
    }

    const updated = await MessageAttachmentRepository.save(attachment);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const attachment = await MessageAttachmentRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!attachment)
      return res.status(404).json({ message: "Attachment not found" });

    await MessageAttachmentRepository.remove(attachment);
    res.status(204).send();
  }) as RequestHandler,
};
