import { Request, Response, RequestHandler } from "express";
import { WarehouseLayoutRepository } from "../repositories/WarehouseLayoutRepository";
import { WarehouseRepository } from "../repositories/WarehouseRepository";

export const WarehouseLayoutController = {
  getAll: (async (req: Request, res: Response) => {
    const layouts = await WarehouseLayoutRepository.find({
      relations: ["warehouse"],
    });
    res.json(layouts);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const layout = await WarehouseLayoutRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["warehouse"],
    });
    if (!layout) return res.status(404).json({ message: "Layout not found" });
    res.json(layout);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { warehouse_id, layout_image_url, occupancy_json, percent_occupied } =
      req.body;

    const warehouse = await WarehouseRepository.findOne({
      where: { id: warehouse_id },
    });
    if (!warehouse)
      return res.status(400).json({ message: "Invalid warehouse_id" });

    const layout = WarehouseLayoutRepository.create({
      warehouse,
      layout_image_url,
      occupancy_json,
      percent_occupied,
    });

    const saved = await WarehouseLayoutRepository.save(layout);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const layout = await WarehouseLayoutRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!layout) return res.status(404).json({ message: "Layout not found" });

    const { layout_image_url, occupancy_json, percent_occupied } = req.body;

    layout.layout_image_url = layout_image_url ?? layout.layout_image_url;
    layout.occupancy_json = occupancy_json ?? layout.occupancy_json;
    layout.percent_occupied = percent_occupied ?? layout.percent_occupied;

    const updated = await WarehouseLayoutRepository.save(layout);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const layout = await WarehouseLayoutRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!layout) return res.status(404).json({ message: "Layout not found" });

    await WarehouseLayoutRepository.remove(layout);
    res.status(204).send();
  }) as RequestHandler,
};
