// src/controllers/InventoryBatchController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { InventoryBatch } from "../../entities/new/InventoryBatch";
import { Component } from "../../entities/Component";
import { Warehouse } from "../../entities/Warehouse";

export const InventoryBatchController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { componentId, warehouseId } = req.query;

      const repo = AppDataSource.getRepository(InventoryBatch);
      const batches = await repo.find({
        where: {
          ...(componentId ? { component: { id: Number(componentId) } } : {}),
          ...(warehouseId ? { warehouse: { id: Number(warehouseId) } } : {}),
        },
        relations: ["component", "warehouse"],
        order: { received_date: "DESC" },
      });

      res.json(batches);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch inventory batches" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(InventoryBatch);
      const batch = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["component", "warehouse"],
      });

      if (!batch) return res.status(404).json({ error: "Batch not found" });
      res.json(batch);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch batch" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        batch_number,
        componentId,
        warehouseId,
        qty,
        received_date,
        expiry_date,
        supplier_lot_ref,
        notes,
      } = req.body;

      const component = await AppDataSource.getRepository(Component).findOneBy({
        id: componentId,
      });
      const warehouse = await AppDataSource.getRepository(Warehouse).findOneBy({
        id: warehouseId,
      });

      if (!component || !warehouse) {
        return res
          .status(400)
          .json({ error: "Invalid component or warehouse ID" });
      }

      const repo = AppDataSource.getRepository(InventoryBatch);
      const batch = repo.create({
        batch_number,
        component,
        warehouse,
        qty,
        received_date,
        expiry_date,
        supplier_lot_ref,
        notes,
      });

      const saved = await repo.save(batch);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create batch" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        batch_number,
        componentId,
        warehouseId,
        qty,
        received_date,
        expiry_date,
        supplier_lot_ref,
        notes,
      } = req.body;

      const repo = AppDataSource.getRepository(InventoryBatch);
      const batch = await repo.findOneBy({ id: Number(req.params.id) });

      if (!batch) return res.status(404).json({ error: "Batch not found" });

      let component = batch.component;
      let warehouse = batch.warehouse;

      if (componentId) {
        const foundComponent = await AppDataSource.getRepository(
          Component
        ).findOneBy({ id: componentId });
        if (!foundComponent)
          return res.status(400).json({ error: "Invalid component ID" });
        component = foundComponent;
      }

      if (warehouseId) {
        const foundWarehouse = await AppDataSource.getRepository(
          Warehouse
        ).findOneBy({ id: warehouseId });
        if (!foundWarehouse)
          return res.status(400).json({ error: "Invalid warehouse ID" });
        warehouse = foundWarehouse;
      }

      batch.batch_number = batch_number;
      batch.component = component;
      batch.warehouse = warehouse;
      batch.qty = qty;
      batch.received_date = received_date;
      batch.expiry_date = expiry_date;
      batch.supplier_lot_ref = supplier_lot_ref;
      batch.notes = notes;

      const updated = await repo.save(batch);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update batch" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(InventoryBatch);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0) {
        return res.status(404).json({ error: "Batch not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete batch" });
    }
  }) as RequestHandler,
};
