import { Request, Response, RequestHandler } from "express";
import { PurchaseOrderRepository } from "../repositories/PurchaseOrderRepository";
import { SupplierRepository } from "../repositories/SupplierRepository";
import { UserRepository } from "../repositories/UserRepository";

export const PurchaseOrderController = {
  getAll: (async (req: Request, res: Response) => {
    const orders = await PurchaseOrderRepository.find({
      relations: ["supplier", "created_by", "items", "shipments"],
    });
    res.json(orders);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const order = await PurchaseOrderRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["supplier", "created_by", "items", "shipments"],
    });
    if (!order)
      return res.status(404).json({ message: "Purchase order not found" });
    res.json(order);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const {
      supplier_id,
      created_by_id,
      status,
      date_created,
      date_expected,
      date_received,
    } = req.body;

    const supplier = await SupplierRepository.findOne({
      where: { id: supplier_id },
    });
    if (!supplier)
      return res.status(400).json({ message: "Invalid supplier_id" });

    const user = await UserRepository.findOne({ where: { id: created_by_id } });
    if (!user)
      return res.status(400).json({ message: "Invalid created_by_id" });

    const order = PurchaseOrderRepository.create({
      supplier,
      created_by: user,
      status,
      date_created,
      date_expected,
      date_received,
    });

    const saved = await PurchaseOrderRepository.save(order);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const order = await PurchaseOrderRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!order)
      return res.status(404).json({ message: "Purchase order not found" });

    const { status, date_expected, date_received } = req.body;

    order.status = status ?? order.status;
    order.date_expected = date_expected ?? order.date_expected;
    order.date_received = date_received ?? order.date_received;

    const updated = await PurchaseOrderRepository.save(order);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const order = await PurchaseOrderRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!order)
      return res.status(404).json({ message: "Purchase order not found" });

    await PurchaseOrderRepository.remove(order);
    res.status(204).send();
  }) as RequestHandler,

  getActivities: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Simulated logic for now
    const activities = [
      { timestamp: new Date(), action: "Created", by: "System" },
      { timestamp: new Date(), action: "Approved", by: "Manager" },
    ];

    res.json(activities);
  }) as RequestHandler,
};
