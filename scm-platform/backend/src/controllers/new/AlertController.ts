// src/controllers/AlertController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { Alert } from "../../entities/new/Alert";
import { User } from "../../entities/User";

export const AlertController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId;
      const alertRepo = AppDataSource.getRepository(Alert);

      const alerts = await alertRepo.find({
        where: userId ? { user: { id: Number(userId) } } : {},
        relations: ["user"],
        order: { timestamp: "DESC" },
      });

      res.json(alerts);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const alert = await AppDataSource.getRepository(Alert).findOne({
        where: { id: Number(req.params.id) },
        relations: ["user"],
      });

      if (!alert) return res.status(404).json({ error: "Alert not found" });
      res.json(alert);
    } catch (err) {
      console.error(`Error fetching alert with ID ${req.params.id}:`, err);
      res.status(500).json({ error: "Failed to fetch alert" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const { type, message, userId } = req.body;

      const alertRepo = AppDataSource.getRepository(Alert);
      const userRepo = AppDataSource.getRepository(User);

      let user = null;
      if (userId) {
        user = await userRepo.findOneBy({ id: userId });
        if (!user)
          return res.status(400).json({ error: "User not found for userId" });
      }

      const alert = alertRepo.create({
        type,
        message,
        user,
        is_read: false,
        timestamp: new Date(),
      });

      const saved = await alertRepo.save(alert);
      res.status(201).json(saved);
    } catch (err) {
      console.error("Error creating alert:", err);
      res.status(500).json({ error: "Failed to create alert" });
    }
  }) as RequestHandler,

  markRead: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Alert);
      const alert = await repo.findOneBy({ id: Number(req.params.id) });

      if (!alert) return res.status(404).json({ error: "Alert not found" });

      alert.is_read = true;
      await repo.save(alert);
      res.status(200).json({ message: "Alert marked as read" });
    } catch (err) {
      console.error(
        `Error marking alert with ID ${req.params.id} as read:`,
        err
      );
      res.status(500).json({ error: "Failed to update alert" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const { type, message, is_read, userId } = req.body;
      const repo = AppDataSource.getRepository(Alert);
      const alert = await repo.findOneBy({ id: Number(req.params.id) });

      if (!alert) return res.status(404).json({ error: "Alert not found" });

      if (userId !== undefined) {
        const user = userId
          ? await AppDataSource.getRepository(User).findOneBy({ id: userId })
          : null;
        if (userId && !user)
          return res.status(400).json({ error: "User not found for userId" });
        alert.user = user;
      }

      if (type !== undefined) alert.type = type;
      if (message !== undefined) alert.message = message;
      if (is_read !== undefined) alert.is_read = is_read;

      const updated = await repo.save(alert);
      res.status(200).json(updated);
    } catch (err) {
      console.error(`Error updating alert with ID ${req.params.id}:`, err);
      res.status(500).json({ error: "Failed to update alert" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Alert);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0)
        return res.status(404).json({ error: "Alert not found" });

      res.sendStatus(204);
    } catch (err) {
      console.error(`Error deleting alert with ID ${req.params.id}:`, err);
      res.status(500).json({ error: "Failed to delete alert" });
    }
  }) as RequestHandler,
};
