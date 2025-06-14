// src/controllers/RiskPredictionController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { RiskPrediction } from "../../entities/new/RiskPrediction";
import { User } from "../../entities/User";
import { CycleCountRepository } from "../../repositories/CycleCountRepository";

export const RiskPredictionController = {
  getAll: (async (req, res) => {
    try {
      const { type, userId } = req.query;

      const predictions = await AppDataSource.getRepository(
        RiskPrediction
      ).find({
        where: {
          ...(type ? { type: String(type) } : {}),
          ...(userId ? { user: { id: Number(userId) } } : {}),
        },
        relations: ["user"],
        order: { predicted_at: "DESC" },
      });

      res.json(predictions);
    } catch (err: any) {
      console.error("Error in getAll:", err);
      res
        .status(500)
        .json({
          error: "Failed to fetch risk predictions",
          details: err.message,
        });
    }
  }) as RequestHandler,

  getById: (async (req, res) => {
    try {
      const prediction = await AppDataSource.getRepository(
        RiskPrediction
      ).findOne({
        where: { id: Number(req.params.id) },
        relations: ["user"],
      });

      if (!prediction) return res.status(404).json({ error: "Not found" });
      res.json(prediction);
    } catch (err: any) {
      console.error("Error in getById:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch prediction", details: err.message });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { type, target_entity, target_id, score, description, userId } =
        req.body;

      const predictionRepo = AppDataSource.getRepository(RiskPrediction);
      const prediction = predictionRepo.create({
        type,
        target_entity,
        target_id,
        score,
        description,
        predicted_at: new Date(),
      });

      if (userId) {
        const user = await AppDataSource.getRepository(User).findOneBy({
          id: userId,
        });
        if (!user) return res.status(400).json({ error: "Invalid user" });
        prediction.user = user;
      }

      const saved = await predictionRepo.save(prediction);
      res.status(201).json(saved);
    } catch (err: any) {
      console.error("Error in create:", err);
      res
        .status(500)
        .json({ error: "Failed to create prediction", details: err.message });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const predictionRepo = AppDataSource.getRepository(RiskPrediction);
      const prediction = await predictionRepo.findOneBy({
        id: Number(req.params.id),
      });

      if (!prediction) return res.status(404).json({ error: "Not found" });

      const { type, target_entity, target_id, score, description } = req.body;

      if (type !== undefined) prediction.type = type;
      if (target_entity !== undefined) prediction.target_entity = target_entity;
      if (target_id !== undefined) prediction.target_id = target_id;
      if (score !== undefined) prediction.score = score;
      if (description !== undefined) prediction.description = description;

      const updated = await predictionRepo.save(prediction);
      res.json(updated);
    } catch (err: any) {
      console.error("Error in update:", err);
      res
        .status(500)
        .json({ error: "Failed to update prediction", details: err.message });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const result = await AppDataSource.getRepository(RiskPrediction).delete(
        Number(req.params.id)
      );
      if (result.affected === 0)
        return res.status(404).json({ error: "Not found" });

      res.sendStatus(204);
    } catch (err: any) {
      console.error("Error in delete:", err);
      res
        .status(500)
        .json({ error: "Failed to delete prediction", details: err.message });
    }
  }) as RequestHandler,

  getCycleCounts: (async (_req, res) => {
    try {
      const counts = await CycleCountRepository.find({ relations: ["component"] });
      res.json(counts);
    } catch (err) {
      console.error("Error in getCycleCounts:", err);
      res.status(500).json({ error: "Failed to fetch cycle count records" });
    }
  }) as RequestHandler,

};
