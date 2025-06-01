// src/controllers/AutomationRuleController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { AutomationRule } from "../../entities/new/AutomationRule";
import { User } from "../../entities/User";

export const AutomationRuleController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { triggerEvent, entityType } = req.query;

      const repo = AppDataSource.getRepository(AutomationRule);
      const rules = await repo.find({
        where: {
          ...(triggerEvent ? { trigger_event: triggerEvent as string } : {}),
          ...(entityType ? { target_entity_type: entityType as string } : {}),
        },
        order: { created_at: "DESC" },
        relations: ["created_by"],
      });

      res.json(rules);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch automation rules" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(AutomationRule);
      const rule = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["created_by"],
      });

      if (!rule) return res.status(404).json({ error: "Rule not found" });
      res.json(rule);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch rule" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        name,
        trigger_event,
        target_entity_type,
        target_entity_id,
        action_definition,
        is_active = true,
        createdBy,
      } = req.body;

      const user = createdBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: createdBy })
        : null;

      const repo = AppDataSource.getRepository(AutomationRule);
      const rule = repo.create({
        name,
        trigger_event,
        target_entity_type,
        target_entity_id,
        action_definition,
        is_active,
        created_by: user,
      });

      const saved = await repo.save(rule);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create rule" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        name,
        trigger_event,
        target_entity_type,
        target_entity_id,
        action_definition,
        is_active,
        createdBy,
      } = req.body;

      const repo = AppDataSource.getRepository(AutomationRule);
      const rule = await repo.findOneBy({ id: Number(req.params.id) });

      if (!rule) return res.status(404).json({ error: "Rule not found" });

      const user = createdBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: createdBy })
        : null;

      rule.name = name;
      rule.trigger_event = trigger_event;
      rule.target_entity_type = target_entity_type;
      rule.target_entity_id = target_entity_id;
      rule.action_definition = action_definition;
      rule.is_active = is_active;
      rule.created_by = user;

      const updated = await repo.save(rule);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update rule" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(AutomationRule);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0) {
        return res.status(404).json({ error: "Rule not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete rule" });
    }
  }) as RequestHandler,
};
