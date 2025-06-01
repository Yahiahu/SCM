// src/controllers/RFQController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { RFQ } from "../../entities/new/RFQ";
import { RFQItem } from "../../entities/new/RFQItem";
import { Supplier } from "../../entities/Supplier";
import { Component } from "../../entities/Component";

export const RFQController = {
  getAll: (async (_req, res) => {
    try {
      const rfqs = await AppDataSource.getRepository(RFQ).find({
        relations: ["supplier", "items", "items.component"],
        order: { created_at: "DESC" },
      });
      res.json(rfqs);
    } catch {
      res.status(500).json({ error: "Failed to fetch RFQs" });
    }
  }) as RequestHandler,

  getById: (async (req, res) => {
    try {
      const rfq = await AppDataSource.getRepository(RFQ).findOne({
        where: { id: Number(req.params.id) },
        relations: ["supplier", "items", "items.component"],
      });

      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      res.json(rfq);
    } catch {
      res.status(500).json({ error: "Failed to fetch RFQ" });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { supplierId, notes, items } = req.body;

      const supplier = await AppDataSource.getRepository(Supplier).findOneBy({
        id: supplierId,
      });
      if (!supplier) {
        return res.status(400).json({ error: "Invalid supplier" });
      }

      const rfqRepo = AppDataSource.getRepository(RFQ);
      const itemRepo = AppDataSource.getRepository(RFQItem);

      const rfq = rfqRepo.create({ supplier, notes });
      const savedRFQ = await rfqRepo.save(rfq);

      const rfqItems = await Promise.all(
        items.map(async (item: any) => {
          const component = await AppDataSource.getRepository(
            Component
          ).findOneBy({ id: item.componentId });
          if (!component) throw new Error("Invalid component ID");

          return itemRepo.create({
            rfq: savedRFQ,
            component,
            qty: item.qty,
          });
        })
      );

      await itemRepo.save(rfqItems);

      const result = await rfqRepo.findOne({
        where: { id: savedRFQ.id },
        relations: ["supplier", "items", "items.component"],
      });

      res.status(201).json(result);
    } catch {
      res.status(500).json({ error: "Failed to create RFQ" });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const { supplierId, notes, items } = req.body;

      const rfqRepo = AppDataSource.getRepository(RFQ);
      const itemRepo = AppDataSource.getRepository(RFQItem);

      const rfq = await rfqRepo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["items"],
      });

      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      if (supplierId) {
        const supplier = await AppDataSource.getRepository(Supplier).findOneBy({
          id: supplierId,
        });
        if (!supplier) {
          return res.status(400).json({ error: "Invalid supplier" });
        }
        rfq.supplier = supplier;
      }

      rfq.notes = notes;

      await itemRepo.delete({ rfq: { id: rfq.id } });

      const rfqItems = await Promise.all(
        items.map(async (item: any) => {
          const component = await AppDataSource.getRepository(
            Component
          ).findOneBy({ id: item.componentId });
          if (!component) throw new Error("Invalid component ID");

          return itemRepo.create({
            rfq,
            component,
            qty: item.qty,
          });
        })
      );

      await itemRepo.save(rfqItems);
      const updated = await rfqRepo.save(rfq);

      const result = await rfqRepo.findOne({
        where: { id: updated.id },
        relations: ["supplier", "items", "items.component"],
      });

      res.json(result);
    } catch {
      res.status(500).json({ error: "Failed to update RFQ" });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const result = await AppDataSource.getRepository(RFQ).delete(
        Number(req.params.id)
      );
      if (result.affected === 0) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Failed to delete RFQ" });
    }
  }) as RequestHandler,
};
