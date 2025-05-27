import { Request, Response, RequestHandler } from "express";
import { WarehouseRepository } from "../repositories/WarehouseRepository";
import { OrganizationRepository } from "../repositories/OrganizationRepository";

export const WarehouseController = {
  getAll: (async (req: Request, res: Response) => {
    const warehouses = await WarehouseRepository.find({
      relations: [
        "organization",
        "inventory",
        "layout_versions",
        "stock_records",
      ],
    });
    res.json(warehouses);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const warehouse = await WarehouseRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: [
        "organization",
        "inventory",
        "layout_versions",
        "stock_records",
      ],
    });
    if (!warehouse)
      return res.status(404).json({ message: "Warehouse not found" });
    res.json(warehouse);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { name, location, organization_id } = req.body;

    const organization = await OrganizationRepository.findOne({
      where: { id: organization_id },
    });
    if (!organization)
      return res.status(400).json({ message: "Invalid organization_id" });

    const warehouse = WarehouseRepository.create({
      name,
      location,
      organization,
    });

    const saved = await WarehouseRepository.save(warehouse);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const warehouse = await WarehouseRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!warehouse)
      return res.status(404).json({ message: "Warehouse not found" });

    const { name, location } = req.body;
    warehouse.name = name ?? warehouse.name;
    warehouse.location = location ?? warehouse.location;

    const updated = await WarehouseRepository.save(warehouse);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const warehouse = await WarehouseRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!warehouse)
      return res.status(404).json({ message: "Warehouse not found" });

    await WarehouseRepository.remove(warehouse);
    res.status(204).send();
  }) as RequestHandler,
};
