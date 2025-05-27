import { Request, Response, RequestHandler } from "express";
import { POConversationThreadRepository } from "../repositories/POConversationThreadRepository";
import { PurchaseOrderRepository } from "../repositories/PurchaseOrderRepository";
import { UserRepository } from "../repositories/UserRepository";

export const POConversationThreadController = {
  getAll: (async (req: Request, res: Response) => {
    const threads = await POConversationThreadRepository.find({
      relations: ["po", "created_by"],
    });
    res.json(threads);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const thread = await POConversationThreadRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["po", "created_by"],
    });
    if (!thread) return res.status(404).json({ message: "Thread not found" });
    res.json(thread);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { po_id, title, created_by_id } = req.body;

    const po = await PurchaseOrderRepository.findOne({ where: { id: po_id } });
    if (!po) return res.status(400).json({ message: "Invalid po_id" });

    const user = await UserRepository.findOne({ where: { id: created_by_id } });
    if (!user)
      return res.status(400).json({ message: "Invalid created_by_id" });

    const thread = POConversationThreadRepository.create({
      po,
      title,
      created_by: user,
    });

    const saved = await POConversationThreadRepository.save(thread);
    res.status(201).json(saved);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const thread = await POConversationThreadRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    await POConversationThreadRepository.remove(thread);
    res.status(204).send();
  }) as RequestHandler,
};
