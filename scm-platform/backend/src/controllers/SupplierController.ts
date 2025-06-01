import { Request, Response, RequestHandler } from "express";
import { SupplierRepository } from "../repositories/SupplierRepository";

export const SupplierController = {
  getAll: (async (req: Request, res: Response) => {
    const suppliers = await SupplierRepository.find();
    res.json(suppliers);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const supplier = await SupplierRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        name,
        rating,
        contact_email,
        location,
        phone,
        historical_ontime_rate,
        avg_unit_cost,
        last_response_time,
        preferred,
      } = req.body;

      // Validate required fields
      if (!name || !contact_email || !phone || !location) {
        return res.status(400).json({
          message:
            "Missing required fields: name, contact_email, phone, location",
        });
      }

      const supplier = SupplierRepository.create({
        name,
        rating: rating ?? 4, // default to 4 if not provided
        contact_email,
        location,
        phone,
        historical_ontime_rate: historical_ontime_rate ?? 0.9,
        avg_unit_cost: avg_unit_cost ?? 10.0,
        last_response_time: last_response_time ?? 24,
        preferred: preferred ?? false,
      });

      const saved = await SupplierRepository.save(supplier);
      res.status(201).json(saved);
    } catch (error: any) {
      console.error("Supplier creation error:", error);
      if (error.code === "23505") {
        return res.status(409).json({ message: "Duplicate supplier entry" });
      }
      res.status(500).json({ message: "Failed to create supplier." });
    }
  }) as RequestHandler,

  
  update: (async (req: Request, res: Response) => {
    const supplier = await SupplierRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    const {
      name,
      rating,
      contact_email,
      location,
      phone,
      historical_ontime_rate,
      avg_unit_cost,
      last_response_time,
      preferred,
    } = req.body;

    supplier.name = name ?? supplier.name;
    supplier.rating = rating ?? supplier.rating;
    supplier.contact_email = contact_email ?? supplier.contact_email;
    supplier.location = location ?? supplier.location;
    supplier.phone = phone ?? supplier.phone;
    supplier.historical_ontime_rate =
      historical_ontime_rate ?? supplier.historical_ontime_rate;
    supplier.avg_unit_cost = avg_unit_cost ?? supplier.avg_unit_cost;
    supplier.last_response_time =
      last_response_time ?? supplier.last_response_time;
    supplier.preferred = preferred ?? supplier.preferred;

    const updated = await SupplierRepository.save(supplier);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const supplier = await SupplierRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    await SupplierRepository.remove(supplier);
    res.status(204).send();
  }) as RequestHandler,
};
