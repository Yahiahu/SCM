// src/controllers/LandedCostController.ts
import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { LandedCost } from "../../entities/new/LandedCost";
import { Component } from "../../entities/Component";
import { PurchaseOrder } from "../../entities/PurchaseOrder";
import { ShippingInfo } from "../../entities/ShippingInfo";

export const LandedCostController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const { componentId, purchaseOrderId } = req.query;

      const landedCosts = await AppDataSource.getRepository(LandedCost).find({
        where: {
          ...(componentId ? { component: { id: Number(componentId) } } : {}),
          ...(purchaseOrderId
            ? { purchase_order: { id: Number(purchaseOrderId) } }
            : {}),
        },
        relations: ["component", "purchase_order", "shipment"],
        order: { recorded_at: "DESC" },
      });

      res.json(landedCosts);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch landed costs" });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const landedCost = await AppDataSource.getRepository(LandedCost).findOne({
        where: { id: Number(req.params.id) },
        relations: ["component", "purchase_order", "shipment"],
      });

      if (!landedCost)
        return res.status(404).json({ error: "Landed cost not found" });

      res.json(landedCost);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch landed cost" });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        componentId,
        purchaseOrderId,
        shipmentId,
        base_unit_cost,
        freight_cost,
        duty_cost,
        handling_cost,
        total_unit_cost,
        notes,
      } = req.body;

      const component = await AppDataSource.getRepository(Component).findOneBy({
        id: componentId,
      });
      const po = await AppDataSource.getRepository(PurchaseOrder).findOneBy({
        id: purchaseOrderId,
      });
      const shipment = shipmentId
        ? await AppDataSource.getRepository(ShippingInfo).findOneBy({
            id: shipmentId,
          })
        : null;

      if (!component || !po) {
        return res
          .status(400)
          .json({ error: "Invalid component or purchase order ID" });
      }

      const landedCost = AppDataSource.getRepository(LandedCost).create({
        component,
        purchase_order: po,
        shipment,
        base_unit_cost,
        freight_cost,
        duty_cost,
        handling_cost,
        total_unit_cost,
        notes,
      });

      const saved = await AppDataSource.getRepository(LandedCost).save(
        landedCost
      );
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to create landed cost" });
    }
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    try {
      const {
        componentId,
        purchaseOrderId,
        shipmentId,
        base_unit_cost,
        freight_cost,
        duty_cost,
        handling_cost,
        total_unit_cost,
        notes,
      } = req.body;

      const repo = AppDataSource.getRepository(LandedCost);
      const landedCost = await repo.findOneBy({ id: Number(req.params.id) });

      if (!landedCost)
        return res.status(404).json({ error: "Landed cost not found" });

      let component = landedCost.component;
      let po = landedCost.purchase_order;
      let shipment = landedCost.shipment;

      if (componentId) {
        const foundComponent = await AppDataSource.getRepository(
          Component
        ).findOneBy({ id: componentId });
        if (!foundComponent)
          return res.status(400).json({ error: "Invalid component ID" });
        component = foundComponent;
      }

      if (purchaseOrderId) {
        const foundPO = await AppDataSource.getRepository(
          PurchaseOrder
        ).findOneBy({ id: purchaseOrderId });
        if (!foundPO)
          return res.status(400).json({ error: "Invalid purchase order ID" });
        po = foundPO;
      }

      if (shipmentId) {
        const foundShipment = await AppDataSource.getRepository(
          ShippingInfo
        ).findOneBy({ id: shipmentId });
        if (!foundShipment)
          return res.status(400).json({ error: "Invalid shipment ID" });
        shipment = foundShipment;
      }

      landedCost.component = component;
      landedCost.purchase_order = po;
      landedCost.shipment = shipment;
      landedCost.base_unit_cost = base_unit_cost;
      landedCost.freight_cost = freight_cost;
      landedCost.duty_cost = duty_cost;
      landedCost.handling_cost = handling_cost;
      landedCost.total_unit_cost = total_unit_cost;
      landedCost.notes = notes;

      const updated = await repo.save(landedCost);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update landed cost" });
    }
  }) as RequestHandler,

  delete: (async (req: Request, res: Response) => {
    try {
      const result = await AppDataSource.getRepository(LandedCost).delete(
        Number(req.params.id)
      );

      if (result.affected === 0) {
        return res.status(404).json({ error: "Landed cost not found" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete landed cost" });
    }
  }) as RequestHandler,
};
