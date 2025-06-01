// src/controllers/TaskController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { Task } from "../../entities/new/Task";
import { User } from "../../entities/User";

export const TaskController = {
  getAll: (async (req, res) => {
    try {
      const { assignedToId, status } = req.query;

      const tasks = await AppDataSource.getRepository(Task).find({
        where: {
          ...(assignedToId
            ? { assigned_to: { id: Number(assignedToId) } }
            : {}),
          ...(status ? { status: status.toString() } : {}),
        },
        relations: ["assigned_to", "created_by"],
        order: { due_date: "ASC" },
      });

      res.json(tasks);
    } catch {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }) as RequestHandler,

  getById: (async (req, res) => {
    try {
      const task = await AppDataSource.getRepository(Task).findOne({
        where: { id: Number(req.params.id) },
        relations: ["assigned_to", "created_by"],
      });

      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const {
        title,
        description,
        status,
        due_date,
        assignedToId,
        createdById,
      } = req.body;

      const taskRepo = AppDataSource.getRepository(Task);
      const userRepo = AppDataSource.getRepository(User);

      const task = taskRepo.create({
        title,
        description,
        status,
        due_date: new Date(due_date),
      });

      if (assignedToId) {
        const assignee = await userRepo.findOneBy({ id: assignedToId });
        if (!assignee)
          return res.status(400).json({ error: "Invalid assigned user" });
        task.assigned_to = assignee;
      }

      if (createdById) {
        const creator = await userRepo.findOneBy({ id: createdById });
        if (!creator) return res.status(400).json({ error: "Invalid creator" });
        task.created_by = creator;
      }

      const saved = await taskRepo.save(task);
      res.status(201).json(saved);
    } catch {
      res.status(500).json({ error: "Failed to create task" });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const taskRepo = AppDataSource.getRepository(Task);
      const userRepo = AppDataSource.getRepository(User);

      const task = await taskRepo.findOneBy({ id: Number(req.params.id) });
      if (!task) return res.status(404).json({ error: "Task not found" });

      const { title, description, status, due_date, assignedToId } = req.body;

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status;
      if (due_date !== undefined) task.due_date = new Date(due_date);

      if (assignedToId) {
        const assignee = await userRepo.findOneBy({ id: assignedToId });
        if (!assignee)
          return res.status(400).json({ error: "Invalid assignee" });
        task.assigned_to = assignee;
      }

      const updated = await taskRepo.save(task);
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update task" });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const result = await AppDataSource.getRepository(Task).delete(
        Number(req.params.id)
      );
      if (result.affected === 0)
        return res.status(404).json({ error: "Task not found" });

      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Failed to delete task" });
    }
  }) as RequestHandler,
};
