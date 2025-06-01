// src/controllers/BinLocationController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { BinLocation } from "../../entities/new/BinLocation";
import { Warehouse } from "../../entities/Warehouse";

export const BinLocationController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { warehouseId } = req.query;

      const repo = AppDataSource.getRepository(BinLocation);
      const bins = await repo.find({
        where: warehouseId ? { warehouse: { id: Number(warehouseId) } } : {},
        relations: ["warehouse"],
        order: { label: "ASC" },
      });

      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch bin locations" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(BinLocation);
      const bin = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["warehouse"],
      });

      if (!bin) return res.status(404).json({ error: "Bin not found" });
      res.json(bin);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch bin" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const { label, description, zone, warehouseId } = req.body;

      const warehouse = await AppDataSource.getRepository(Warehouse).findOneBy({
        id: warehouseId,
      });

      if (!warehouse) {
        return res.status(400).json({ error: "Invalid warehouse ID" });
      }

      const repo = AppDataSource.getRepository(BinLocation);
      const bin = repo.create({
        label,
        description,
        zone,
        warehouse,
      });

      const saved = await repo.save(bin);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create bin location" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const { label, description, zone, warehouseId } = req.body;
      const repo = AppDataSource.getRepository(BinLocation);

      const bin = await repo.findOneBy({ id: Number(req.params.id) });
      if (!bin) return res.status(404).json({ error: "Bin not found" });

      let warehouse: Warehouse | null = null;
      if (warehouseId !== undefined) {
        warehouse = await AppDataSource.getRepository(Warehouse).findOneBy({
          id: warehouseId,
        });

        if (!warehouse) {
          return res.status(400).json({ error: "Invalid warehouse ID" });
        }
      }

      bin.label = label;
      bin.description = description;
      bin.zone = zone;
      if (warehouse) bin.warehouse = warehouse;

      const updated = await repo.save(bin);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update bin" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(BinLocation);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0) {
        return res.status(404).json({ error: "Bin not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete bin" });
    }
  }) as RequestHandler,
};
