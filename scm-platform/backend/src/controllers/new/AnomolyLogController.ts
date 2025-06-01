// src/controllers/AnomalyController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { AnomalyLog } from "../../entities/new/AnomalyLog";
import { User } from "../../entities/User";

export const AnomalyController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { entityType, entityId } = req.query;

      const repo = AppDataSource.getRepository(AnomalyLog);
      const anomalies = await repo.find({
        where: {
          ...(entityType ? { entity_type: entityType as string } : {}),
          ...(entityId ? { entity_id: Number(entityId) } : {}),
        },
        order: { timestamp: "DESC" },
        relations: ["reviewer"],
      });

      res.json(anomalies);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch anomalies" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(AnomalyLog);
      const anomaly = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["reviewer"],
      });

      if (!anomaly) return res.status(404).json({ error: "Anomaly not found" });

      res.json(anomaly);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch anomaly" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        entity_type,
        entity_id,
        description,
        severity_score,
        detected_by,
        reviewerId,
      } = req.body;

      const user = reviewerId
        ? await AppDataSource.getRepository(User).findOneBy({ id: reviewerId })
        : null;

      const anomalyRepo = AppDataSource.getRepository(AnomalyLog);
      const newAnomaly = anomalyRepo.create({
        entity_type,
        entity_id,
        description,
        severity_score,
        detected_by,
        reviewer: user,
      });

      const saved = await anomalyRepo.save(newAnomaly);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create anomaly" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        entity_type,
        entity_id,
        description,
        severity_score,
        detected_by,
        reviewerId,
      } = req.body;

      const repo = AppDataSource.getRepository(AnomalyLog);
      const anomaly = await repo.findOneBy({ id: Number(req.params.id) });

      if (!anomaly) return res.status(404).json({ error: "Anomaly not found" });

      const reviewer = reviewerId
        ? await AppDataSource.getRepository(User).findOneBy({ id: reviewerId })
        : null;

      anomaly.entity_type = entity_type;
      anomaly.entity_id = entity_id;
      anomaly.description = description;
      anomaly.severity_score = severity_score;
      anomaly.detected_by = detected_by;
      anomaly.reviewer = reviewer;

      const updated = await repo.save(anomaly);
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update anomaly" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(AnomalyLog);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0)
        return res.status(404).json({ error: "Anomaly not found" });

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete anomaly" });
    }
  }) as RequestHandler,
};
