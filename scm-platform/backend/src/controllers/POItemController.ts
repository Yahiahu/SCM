import { Request, Response, RequestHandler } from "express";
import { POItemRepository } from "../repositories/POItemRepository";
import { PurchaseOrderRepository } from "../repositories/PurchaseOrderRepository";
import { ComponentRepository } from "../repositories/ComponentRepository";

export const POItemController = {
  getAll: (async (req: Request, res: Response) => {
    const items = await POItemRepository.find({
      relations: ["po", "component"],
    });
    res.json(items);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const item = await POItemRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["po", "component"],
    });
    if (!item) return res.status(404).json({ message: "PO item not found" });
    res.json(item);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { po_id, component_id, ordered_qty, received_qty, unit_cost } =
      req.body;

    const po = await PurchaseOrderRepository.findOne({ where: { id: po_id } });
    if (!po) return res.status(400).json({ message: "Invalid po_id" });

    const component = await ComponentRepository.findOne({
      where: { id: component_id },
    });
    if (!component)
      return res.status(400).json({ message: "Invalid component_id" });

    const item = POItemRepository.create({
      po,
      component,
      ordered_qty,
      received_qty,
      unit_cost,
    });

    const saved = await POItemRepository.save(item);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const item = await POItemRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!item) return res.status(404).json({ message: "PO item not found" });

    const { ordered_qty, received_qty, unit_cost } = req.body;

    item.ordered_qty = ordered_qty ?? item.ordered_qty;
    item.received_qty = received_qty ?? item.received_qty;
    item.unit_cost = unit_cost ?? item.unit_cost;

    const updated = await POItemRepository.save(item);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const item = await POItemRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!item) return res.status(404).json({ message: "PO item not found" });

    await POItemRepository.remove(item);
    res.status(204).send();
  }) as RequestHandler,
};
