// src/controllers/InventoryTransactionController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { InventoryTransaction } from "../../entities/new/InventoryTransaction";
import { Component } from "../../entities/Component";
import { Warehouse } from "../../entities/Warehouse";
import { User } from "../../entities/User";

export const InventoryTransactionController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { componentId, warehouseId } = req.query;

      const transactions = await AppDataSource.getRepository(
        InventoryTransaction
      ).find({
        where: {
          ...(componentId ? { component: { id: Number(componentId) } } : {}),
          ...(warehouseId ? { warehouse: { id: Number(warehouseId) } } : {}),
        },
        relations: ["component", "warehouse", "performed_by"],
        order: { timestamp: "DESC" },
      });

      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const tx = await AppDataSource.getRepository(
        InventoryTransaction
      ).findOne({
        where: { id: Number(req.params.id) },
        relations: ["component", "warehouse", "performed_by"],
      });

      if (!tx) return res.status(404).json({ error: "Transaction not found" });
      res.json(tx);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        componentId,
        warehouseId,
        type,
        quantity,
        reference,
        notes,
        performedBy,
      } = req.body;

      const component = await AppDataSource.getRepository(Component).findOneBy({
        id: componentId,
      });
      const warehouse = await AppDataSource.getRepository(Warehouse).findOneBy({
        id: warehouseId,
      });
      const user = performedBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: performedBy })
        : null;

      if (!component || !warehouse) {
        return res
          .status(400)
          .json({ error: "Invalid component or warehouse ID" });
      }

      const repo = AppDataSource.getRepository(InventoryTransaction);
      const tx = repo.create({
        component,
        warehouse,
        type,
        quantity,
        reference,
        notes,
        performed_by: user,
      });

      const saved = await repo.save(tx);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        componentId,
        warehouseId,
        type,
        quantity,
        reference,
        notes,
        performedBy,
      } = req.body;

      const repo = AppDataSource.getRepository(InventoryTransaction);
      const tx = await repo.findOneBy({ id: Number(req.params.id) });

      if (!tx) return res.status(404).json({ error: "Transaction not found" });

      let component = tx.component;
      let warehouse = tx.warehouse;

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

      const user = performedBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: performedBy })
        : tx.performed_by;

      tx.component = component;
      tx.warehouse = warehouse;
      tx.type = type;
      tx.quantity = quantity;
      tx.reference = reference;
      tx.notes = notes;
      tx.performed_by = user;

      const updated = await repo.save(tx);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(InventoryTransaction);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  }) as RequestHandler,
};
