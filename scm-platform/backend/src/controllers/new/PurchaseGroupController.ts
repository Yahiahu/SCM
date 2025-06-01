// src/controllers/PurchaseGroupController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { PurchaseGroup } from "../../entities/new/PurchaseGroup";
import { PurchaseOrder } from "../../entities/PurchaseOrder";
import { In } from "typeorm";

export const PurchaseGroupController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const groups = await AppDataSource.getRepository(PurchaseGroup).find({
        relations: ["purchase_orders"],
        order: { created_at: "DESC" },
      });
      res.json(groups);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch purchase groups" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const group = await AppDataSource.getRepository(PurchaseGroup).findOne({
        where: { id: Number(req.params.id) },
        relations: ["purchase_orders"],
      });

      if (!group) return res.status(404).json({ error: "Group not found" });
      res.json(group);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch group" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const { name, notes, purchaseOrderIds } = req.body;

      const poRepo = AppDataSource.getRepository(PurchaseOrder);
      const purchaseOrders = purchaseOrderIds?.length
        ? await poRepo.find({ where: { id: In(purchaseOrderIds) } })
        : [];

      const group = AppDataSource.getRepository(PurchaseGroup).create({
        name,
        notes,
        purchase_orders: purchaseOrders,
      });

      const saved = await AppDataSource.getRepository(PurchaseGroup).save(
        group
      );
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create purchase group" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const { name, notes, purchaseOrderIds } = req.body;
      const repo = AppDataSource.getRepository(PurchaseGroup);
      const group = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["purchase_orders"],
      });

      if (!group) return res.status(404).json({ error: "Group not found" });

      const poRepo = AppDataSource.getRepository(PurchaseOrder);
      const purchaseOrders = purchaseOrderIds?.length
        ? await poRepo.find({ where: { id: In(purchaseOrderIds) } })
        : [];

      group.name = name;
      group.notes = notes;
      group.purchase_orders = purchaseOrders;

      const updated = await repo.save(group);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update purchase group" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const result = await AppDataSource.getRepository(PurchaseGroup).delete(
        Number(req.params.id)
      );
      if (result.affected === 0) {
        return res.status(404).json({ error: "Group not found" });
      }
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete purchase group" });
    }
  }) as RequestHandler,
};
