// src/controllers/InventoryValuationController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { InventoryValuation } from "../../entities/new/InventoryValuation";
import { Component } from "../../entities/Component";
import { Warehouse } from "../../entities/Warehouse";

export const InventoryValuationController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { componentId, warehouseId } = req.query;

      const valuations = await AppDataSource.getRepository(
        InventoryValuation
      ).find({
        where: {
          ...(componentId ? { component: { id: Number(componentId) } } : {}),
          ...(warehouseId ? { warehouse: { id: Number(warehouseId) } } : {}),
        },
        relations: ["component", "warehouse"],
        order: { valuation_date: "DESC" },
      });

      res.json(valuations);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch valuations" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const valuation = await AppDataSource.getRepository(
        InventoryValuation
      ).findOne({
        where: { id: Number(req.params.id) },
        relations: ["component", "warehouse"],
      });

      if (!valuation)
        return res.status(404).json({ error: "Valuation not found" });

      res.json(valuation);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch valuation" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        componentId,
        warehouseId,
        quantity,
        unit_cost,
        total_value,
        valuation_method,
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

      const valuation = AppDataSource.getRepository(InventoryValuation).create({
        component,
        warehouse,
        quantity,
        unit_cost,
        total_value,
        valuation_method,
      });

      const saved = await AppDataSource.getRepository(InventoryValuation).save(
        valuation
      );
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create valuation" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        componentId,
        warehouseId,
        quantity,
        unit_cost,
        total_value,
        valuation_method,
      } = req.body;

      const repo = AppDataSource.getRepository(InventoryValuation);
      const valuation = await repo.findOneBy({ id: Number(req.params.id) });

      if (!valuation)
        return res.status(404).json({ error: "Valuation not found" });

      let component = valuation.component;
      let warehouse = valuation.warehouse;

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

      valuation.component = component;
      valuation.warehouse = warehouse;
      valuation.quantity = quantity;
      valuation.unit_cost = unit_cost;
      valuation.total_value = total_value;
      valuation.valuation_method = valuation_method;

      const updated = await repo.save(valuation);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update valuation" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(InventoryValuation);
      const result = await repo.delete(Number(req.params.id));

      if (result.affected === 0) {
        return res.status(404).json({ error: "Valuation not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete valuation" });
    }
  }) as RequestHandler,
};
