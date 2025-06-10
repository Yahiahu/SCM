import { Request, Response, RequestHandler } from "express";
import { AuditLogRepository } from "../repositories/AuditLogRepository";
import { UserRepository } from "../repositories/UserRepository";

export const AuditLogController = {
  getAll: (async (req: Request, res: Response) => {
    const logs = await AuditLogRepository.find({
      relations: ["actor"],
      order: { timestamp: "DESC" },
    });
    res.json(logs);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const log = await AuditLogRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["actor"],
    });
    if (!log) return res.status(404).json({ message: "Audit log not found" });
    res.json(log);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { entity_type, entity_id, action_type, actor_id, change_summary } =
      req.body;

    const log = AuditLogRepository.create({
      entity_type,
      entity_id,
      action_type,
      change_summary,
    });

    if (actor_id) {
      const user = await UserRepository.findOne({ where: { id: actor_id } });
      if (!user) return res.status(400).json({ message: "Invalid actor_id" });
      log.actor = user;
    }

    const saved = await AuditLogRepository.save(log);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { entity_type, entity_id, action_type, actor_id, change_summary } =
      req.body;

    const log = await AuditLogRepository.findOne({ where: { id } });
    if (!log) return res.status(404).json({ message: "Audit log not found" });

    log.entity_type = entity_type ?? log.entity_type;
    log.entity_id = entity_id ?? log.entity_id;
    log.action_type = action_type ?? log.action_type;
    log.change_summary = change_summary ?? log.change_summary;

    if (actor_id !== undefined) {
      const user = await UserRepository.findOne({ where: { id: actor_id } });
      log.actor = user ?? null;
    }

    const updated = await AuditLogRepository.save(log);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const existing = await AuditLogRepository.findOne({ where: { id } });
    if (!existing)
      return res.status(404).json({ message: "Audit log not found" });

    await AuditLogRepository.remove(existing);
    res.status(204).send();
  }) as RequestHandler,

  // New method for getting recent audit logs
  getRecent: (async (req: Request, res: Response) => {
    try {
      const logs = await AuditLogRepository.find({
        order: { timestamp: "DESC" },
        take: 10,
        relations: ["actor"], // Include actor relations if needed for recent logs
      });
      res.json(logs);
    } catch (err) {
      console.error("Audit log error:", err);
      res.status(500).json({ error: "Failed to fetch recent audit logs" });
    }
  }) as RequestHandler,
};
