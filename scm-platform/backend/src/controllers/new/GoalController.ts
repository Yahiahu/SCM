// src/controllers/GoalController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { Goal } from "../../entities/new/Goal";
import { User } from "../../entities/User";
import { Organization } from "../../entities/Organization";

export const GoalController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { orgId } = req.query;

      const repo = AppDataSource.getRepository(Goal);
      const goals = await repo.find({
        where: orgId ? { organization: { id: Number(orgId) } } : {},
        relations: ["organization", "created_by"],
        order: { created_at: "DESC" },
      });

      res.json(goals);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Goal);
      const goal = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["organization", "created_by"],
      });

      if (!goal) return res.status(404).json({ error: "Goal not found" });
      res.json(goal);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch goal" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        name,
        kpi_metric,
        target_value,
        description,
        unit,
        due_date,
        organizationId,
        createdBy,
      } = req.body;

      const org = await AppDataSource.getRepository(Organization).findOneBy({
        id: organizationId,
      });
      if (!org)
        return res.status(400).json({ error: "Invalid organization ID" });

      const user = createdBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: createdBy })
        : null;

      const goal = AppDataSource.getRepository(Goal).create({
        name,
        kpi_metric,
        target_value,
        description,
        unit,
        due_date,
        organization: org,
        created_by: user,
      });

      const saved = await AppDataSource.getRepository(Goal).save(goal);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create goal" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        name,
        kpi_metric,
        target_value,
        description,
        unit,
        due_date,
        is_active,
        organizationId,
        createdBy,
      } = req.body;

      const repo = AppDataSource.getRepository(Goal);
      const goal = await repo.findOneBy({ id: Number(req.params.id) });
      if (!goal) return res.status(404).json({ error: "Goal not found" });

      let org = goal.organization;
      if (organizationId) {
        const foundOrg = await AppDataSource.getRepository(
          Organization
        ).findOneBy({ id: organizationId });
        if (!foundOrg)
          return res.status(400).json({ error: "Invalid organization ID" });
        org = foundOrg;
      }

      const user = createdBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: createdBy })
        : goal.created_by;

      goal.name = name;
      goal.kpi_metric = kpi_metric;
      goal.target_value = target_value;
      goal.description = description;
      goal.unit = unit;
      goal.due_date = due_date;
      goal.is_active = is_active;
      goal.organization = org; // ✅ org is guaranteed to be Organization
      goal.created_by = user;

      const updated = await repo.save(goal);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update goal" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Goal);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0) {
        return res.status(404).json({ error: "Goal not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete goal" });
    }
  }) as RequestHandler,
};
