// src/controllers/SupplierScoreController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { SupplierScore } from "../../entities/new/SupplierScorecard";
import { Supplier } from "../../entities/Supplier";

export const SupplierScoreController = {
  getAll: (async (req, res) => {
    try {
      const { supplierId } = req.query;
      const repo = AppDataSource.getRepository(SupplierScore);

      const scores = await repo.find({
        where: supplierId ? { supplier: { id: Number(supplierId) } } : {},
        relations: ["supplier"],
        order: { date: "DESC" },
      });

      res.json(scores);
    } catch {
      res.status(500).json({ error: "Failed to fetch supplier scores" });
    }
  }) as RequestHandler,

  getById: (async (req, res) => {
    try {
      const repo = AppDataSource.getRepository(SupplierScore);
      const score = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["supplier"],
      });

      if (!score) return res.status(404).json({ error: "Score not found" });
      res.json(score);
    } catch {
      res.status(500).json({ error: "Failed to fetch score" });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const {
        supplierId,
        quality_score,
        cost_score,
        responsiveness_score,
        notes,
        date,
      } = req.body;

      const supplier = await AppDataSource.getRepository(Supplier).findOneBy({
        id: supplierId,
      });
      if (!supplier)
        return res.status(400).json({ error: "Invalid supplier ID" });

      const scoreRepo = AppDataSource.getRepository(SupplierScore);
      const score = scoreRepo.create({
        supplier,
        quality_rating: quality_score,
        cost_competitiveness: cost_score,
        responsiveness: responsiveness_score,
        notes,
        evaluated_at: new Date(date),
      });


      const saved = await scoreRepo.save(score);
      res.status(201).json(saved);
    } catch {
      res.status(500).json({ error: "Failed to create supplier score" });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const repo = AppDataSource.getRepository(SupplierScore);
      const score = await repo.findOneBy({ id: Number(req.params.id) });

      if (!score) return res.status(404).json({ error: "Score not found" });

      const { quality_score, cost_score, responsiveness_score, notes, date } =
        req.body;

      if (quality_score !== undefined) score.quality_score = quality_score;
      if (cost_score !== undefined) score.cost_score = cost_score;
      if (quality_score !== undefined) score.quality_rating = quality_score;
      if (cost_score !== undefined) score.cost_competitiveness = cost_score;
      if (date) score.evaluated_at = new Date(date);
      if (notes !== undefined) score.notes = notes;
      if (date) score.date = new Date(date);

      const updated = await repo.save(score);
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update supplier score" });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const result = await AppDataSource.getRepository(SupplierScore).delete(
        Number(req.params.id)
      );
      if (result.affected === 0)
        return res.status(404).json({ error: "Score not found" });

      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Failed to delete score" });
    }
  }) as RequestHandler,
};
