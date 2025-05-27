import { Request, Response, RequestHandler } from "express";
import { ShippingInfoRepository } from "../repositories/ShippingInfoRepository";
import { PurchaseOrderRepository } from "../repositories/PurchaseOrderRepository";
import { ComponentRepository } from "../repositories/ComponentRepository";

export const ShippingInfoController = {
  getAll: (async (req: Request, res: Response) => {
    const records = await ShippingInfoRepository.find({
      relations: ["po", "component"],
    });
    res.json(records);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const record = await ShippingInfoRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["po", "component"],
    });
    if (!record)
      return res.status(404).json({ message: "Shipping record not found" });
    res.json(record);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const {
      po_id,
      component_id,
      qty,
      origin,
      destination,
      carrier,
      tracking_number,
      estimated_arrival,
      status,
      current_location,
    } = req.body;

    const po = await PurchaseOrderRepository.findOne({ where: { id: po_id } });
    if (!po) return res.status(400).json({ message: "Invalid po_id" });

    const component = await ComponentRepository.findOne({
      where: { id: component_id },
    });
    if (!component)
      return res.status(400).json({ message: "Invalid component_id" });

    const record = ShippingInfoRepository.create({
      po,
      component,
      qty,
      origin,
      destination,
      carrier,
      tracking_number,
      estimated_arrival,
      status,
      current_location,
    });

    const saved = await ShippingInfoRepository.save(record);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const record = await ShippingInfoRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Shipping record not found" });

    const {
      qty,
      origin,
      destination,
      carrier,
      tracking_number,
      estimated_arrival,
      status,
      current_location,
    } = req.body;

    record.qty = qty ?? record.qty;
    record.origin = origin ?? record.origin;
    record.destination = destination ?? record.destination;
    record.carrier = carrier ?? record.carrier;
    record.tracking_number = tracking_number ?? record.tracking_number;
    record.estimated_arrival = estimated_arrival ?? record.estimated_arrival;
    record.status = status ?? record.status;
    record.current_location = current_location ?? record.current_location;

    const updated = await ShippingInfoRepository.save(record);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const record = await ShippingInfoRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Shipping record not found" });

    await ShippingInfoRepository.remove(record);
    res.status(204).send();
  }) as RequestHandler,
};
