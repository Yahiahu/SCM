// src/controllers/InventoryAuditController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { InventoryAudit } from "../../entities/new/InventoryAudit";
import { Component } from "../../entities/Component";
import { Warehouse } from "../../entities/Warehouse";
import { User } from "../../entities/User";

export const InventoryAuditController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { componentId, warehouseId } = req.query;

      const audits = await AppDataSource.getRepository(InventoryAudit).find({
        where: {
          ...(componentId ? { component: { id: Number(componentId) } } : {}),
          ...(warehouseId ? { warehouse: { id: Number(warehouseId) } } : {}),
        },
        relations: ["component", "warehouse", "conducted_by"],
        order: { audit_date: "DESC" },
      });

      res.json(audits);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch audits" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const audit = await AppDataSource.getRepository(InventoryAudit).findOne({
        where: { id: Number(req.params.id) },
        relations: ["component", "warehouse", "conducted_by"],
      });

      if (!audit) return res.status(404).json({ error: "Audit not found" });
      res.json(audit);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch audit" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        warehouseId,
        componentId,
        recorded_qty,
        counted_qty,
        notes,
        conductedBy,
      } = req.body;

      const warehouse = await AppDataSource.getRepository(Warehouse).findOneBy({
        id: warehouseId,
      });
      const component = await AppDataSource.getRepository(Component).findOneBy({
        id: componentId,
      });
      const user = conductedBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: conductedBy })
        : null;

      if (!warehouse || !component) {
        return res
          .status(400)
          .json({ error: "Invalid warehouse or component ID" });
      }

      const auditRepo = AppDataSource.getRepository(InventoryAudit);
      const newAudit = auditRepo.create({
        warehouse,
        component,
        recorded_qty,
        counted_qty,
        notes,
        conducted_by: user,
      });

      const saved = await auditRepo.save(newAudit);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create audit" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        warehouseId,
        componentId,
        recorded_qty,
        counted_qty,
        notes,
        conductedBy,
      } = req.body;

      const repo = AppDataSource.getRepository(InventoryAudit);
      const audit = await repo.findOneBy({ id: Number(req.params.id) });
      if (!audit) return res.status(404).json({ error: "Audit not found" });

      let warehouse = audit.warehouse;
      let component = audit.component;

      if (warehouseId) {
        const foundWarehouse = await AppDataSource.getRepository(
          Warehouse
        ).findOneBy({ id: warehouseId });
        if (!foundWarehouse)
          return res.status(400).json({ error: "Invalid warehouse ID" });
        warehouse = foundWarehouse;
      }

      if (componentId) {
        const foundComponent = await AppDataSource.getRepository(
          Component
        ).findOneBy({ id: componentId });
        if (!foundComponent)
          return res.status(400).json({ error: "Invalid component ID" });
        component = foundComponent;
      }

      const user = conductedBy
        ? await AppDataSource.getRepository(User).findOneBy({ id: conductedBy })
        : audit.conducted_by;

      audit.warehouse = warehouse;
      audit.component = component;
      audit.recorded_qty = recorded_qty;
      audit.counted_qty = counted_qty;
      audit.notes = notes;
      audit.conducted_by = user;

      const updated = await repo.save(audit);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update audit" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(InventoryAudit);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0) {
        return res.status(404).json({ error: "Audit not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete audit" });
    }
  }) as RequestHandler,
};
