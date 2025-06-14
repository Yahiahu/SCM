import { Request, Response, RequestHandler } from "express";
import { WarehouseInventoryRepository } from "../repositories/WarehouseInventoryRepository";
import { WarehouseRepository } from "../repositories/WarehouseRepository";
import { ComponentRepository } from "../repositories/ComponentRepository";

export const WarehouseInventoryController = {
  getAll: (async (req: Request, res: Response) => {
    const records = await WarehouseInventoryRepository.find({
      relations: ["warehouse", "component"],
    });
    res.json(records);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const record = await WarehouseInventoryRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["warehouse", "component"],
    });
    if (!record)
      return res.status(404).json({ message: "Inventory record not found" });
    res.json(record);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const {
      warehouse_id,
      component_id,
      current_qty,
      incoming_qty,
      outgoing_qty,
    } = req.body;

    const warehouse = await WarehouseRepository.findOne({
      where: { id: warehouse_id },
    });
    if (!warehouse)
      return res.status(400).json({ message: "Invalid warehouse_id" });

    const component = await ComponentRepository.findOne({
      where: { id: component_id },
    });
    if (!component)
      return res.status(400).json({ message: "Invalid component_id" });

    const record = WarehouseInventoryRepository.create({
      warehouse,
      component,
      current_qty,
      incoming_qty,
      outgoing_qty,
    });

    const saved = await WarehouseInventoryRepository.save(record);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const record = await WarehouseInventoryRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Inventory record not found" });

    const { current_qty, incoming_qty, outgoing_qty } = req.body;

    record.current_qty = current_qty ?? record.current_qty;
    record.incoming_qty = incoming_qty ?? record.incoming_qty;
    record.outgoing_qty = outgoing_qty ?? record.outgoing_qty;

    const updated = await WarehouseInventoryRepository.save(record);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const record = await WarehouseInventoryRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Inventory record not found" });

    await WarehouseInventoryRepository.remove(record);
    res.status(204).send();
  }) as RequestHandler,

  getCycleCounts: (async (req: Request, res: Response) => {
    try {
      const records = await WarehouseInventoryRepository.find({
        relations: ["warehouse", "component"],
      });
      res.json(records);
    } catch (err) {
      console.error("Error in getCycleCounts:", err);
      res.status(500).json({ error: "Failed to fetch cycle count records" });
    }
  }) as RequestHandler,
};

