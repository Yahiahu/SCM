// src/controllers/ScenarioModelController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { ScenarioModel } from "../../entities/new/ScenarioModel";
import { User } from "../../entities/User";

export const ScenarioModelController = {
  getAll: (async (req, res) => {
    try {
      const { userId } = req.query;

      const models = await AppDataSource.getRepository(ScenarioModel).find({
        where: userId ? { user: { id: Number(userId) } } : {},
        relations: ["user"],
        order: { created_at: "DESC" },
      });

      res.json(models);
    } catch {
      res.status(500).json({ error: "Failed to fetch scenario models" });
    }
  }) as RequestHandler,

  getById: (async (req, res) => {
    try {
      const model = await AppDataSource.getRepository(ScenarioModel).findOne({
        where: { id: Number(req.params.id) },
        relations: ["user"],
      });

      if (!model)
        return res.status(404).json({ error: "Scenario model not found" });
      res.json(model);
    } catch {
      res.status(500).json({ error: "Failed to fetch model" });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { name, description, input_data, output_data, status, userId } =
        req.body;

      const modelRepo = AppDataSource.getRepository(ScenarioModel);
      const model = modelRepo.create({
        name,
        description,
        input_data,
        output_data,
        status,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (userId) {
        const user = await AppDataSource.getRepository(User).findOneBy({
          id: userId,
        });
        if (!user) return res.status(400).json({ error: "Invalid user" });
        model.user = user;
      }

      const saved = await modelRepo.save(model);
      res.status(201).json(saved);
    } catch {
      res.status(500).json({ error: "Failed to create scenario model" });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const modelRepo = AppDataSource.getRepository(ScenarioModel);
      const model = await modelRepo.findOneBy({ id: Number(req.params.id) });

      if (!model) return res.status(404).json({ error: "Model not found" });

      const { name, description, input_data, output_data, status } = req.body;

      if (name !== undefined) model.name = name;
      if (description !== undefined) model.description = description;
      if (input_data !== undefined) model.input_data = input_data;
      if (output_data !== undefined) model.output_data = output_data;
      if (status !== undefined) model.status = status;
      model.updated_at = new Date();

      const updated = await modelRepo.save(model);
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update scenario model" });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const result = await AppDataSource.getRepository(ScenarioModel).delete(
        Number(req.params.id)
      );
      if (result.affected === 0)
        return res.status(404).json({ error: "Model not found" });

      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Failed to delete model" });
    }
  }) as RequestHandler,
};
