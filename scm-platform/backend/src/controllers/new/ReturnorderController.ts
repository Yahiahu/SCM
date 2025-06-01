// src/controllers/ReturnOrderController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { ReturnOrder } from "../../entities/new/ReturnOrder";
import { ReturnOrderItem } from "../../entities/new/ReturnOrderItem";
import { PurchaseOrder } from "../../entities/PurchaseOrder";
import { Component } from "../../entities/Component";

export const ReturnOrderController = {
  getAll: (async (_req, res) => {
    try {
      const returns = await AppDataSource.getRepository(ReturnOrder).find({
        relations: ["purchase_order", "items", "items.component"],
        order: { created_at: "DESC" },
      });
      res.json(returns);
    } catch {
      res.status(500).json({ error: "Failed to fetch return orders" });
    }
  }) as RequestHandler,

  getById: (async (req, res) => {
    try {
      const returnOrder = await AppDataSource.getRepository(
        ReturnOrder
      ).findOne({
        where: { id: Number(req.params.id) },
        relations: ["purchase_order", "items", "items.component"],
      });

      if (!returnOrder) {
        return res.status(404).json({ error: "Return order not found" });
      }

      res.json(returnOrder);
    } catch {
      res.status(500).json({ error: "Failed to fetch return order" });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { purchaseOrderId, reason, items } = req.body;

      const po = await AppDataSource.getRepository(PurchaseOrder).findOneBy({
        id: purchaseOrderId,
      });
      if (!po) {
        return res.status(400).json({ error: "Invalid purchase order ID" });
      }

      const returnRepo = AppDataSource.getRepository(ReturnOrder);
      const itemRepo = AppDataSource.getRepository(ReturnOrderItem);

      const returnOrder = returnRepo.create({ purchase_order: po, reason });
      const savedReturn = await returnRepo.save(returnOrder);

      const itemEntities = await Promise.all(
        items.map(async (item: any) => {
          const component = await AppDataSource.getRepository(
            Component
          ).findOneBy({
            id: item.componentId,
          });
          if (!component) throw new Error("Invalid component ID");

          return itemRepo.create({
            return_order: savedReturn,
            component,
            qty: item.qty,
            reason: item.reason,
          });
        })
      );

      await itemRepo.save(itemEntities);

      const result = await returnRepo.findOne({
        where: { id: savedReturn.id },
        relations: ["purchase_order", "items", "items.component"],
      });

      res.status(201).json(result);
    } catch {
      res.status(500).json({ error: "Failed to create return order" });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const { reason, items } = req.body;

      const repo = AppDataSource.getRepository(ReturnOrder);
      const itemRepo = AppDataSource.getRepository(ReturnOrderItem);

      const returnOrder = await repo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["items"],
      });

      if (!returnOrder) {
        return res.status(404).json({ error: "Return order not found" });
      }

      returnOrder.reason = reason;

      await itemRepo.delete({ return_order: { id: returnOrder.id } });

      const itemEntities = await Promise.all(
        items.map(async (item: any) => {
          const component = await AppDataSource.getRepository(
            Component
          ).findOneBy({
            id: item.componentId,
          });
          if (!component) throw new Error("Invalid component ID");

          return itemRepo.create({
            return_order: returnOrder,
            component,
            qty: item.qty,
            reason: item.reason,
          });
        })
      );

      await itemRepo.save(itemEntities);
      await repo.save(returnOrder);

      const result = await repo.findOne({
        where: { id: returnOrder.id },
        relations: ["purchase_order", "items", "items.component"],
      });

      res.json(result);
    } catch {
      res.status(500).json({ error: "Failed to update return order" });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const result = await AppDataSource.getRepository(ReturnOrder).delete(
        Number(req.params.id)
      );
      if (result.affected === 0) {
        return res.status(404).json({ error: "Return order not found" });
      }
      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Failed to delete return order" });
    }
  }) as RequestHandler,
};
