import { Request, Response, RequestHandler } from "express";
import { SupplierQuoteRepository } from "../repositories/SupplierQuoteRepository";
import { SupplierRepository } from "../repositories/SupplierRepository";
import { ComponentRepository } from "../repositories/ComponentRepository";

export const SupplierQuoteController = {
  getAll: (async (req: Request, res: Response) => {
    const quotes = await SupplierQuoteRepository.find({
      relations: ["supplier", "component"],
    });
    res.json(quotes);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const quote = await SupplierQuoteRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["supplier", "component"],
    });
    if (!quote) return res.status(404).json({ message: "Quote not found" });
    res.json(quote);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const {
      supplier_id,
      component_id,
      price_per_unit,
      currency,
      valid_until,
      lead_time_days,
    } = req.body;

    const supplier = await SupplierRepository.findOne({
      where: { id: supplier_id },
    });
    if (!supplier)
      return res.status(400).json({ message: "Invalid supplier_id" });

    const component = await ComponentRepository.findOne({
      where: { id: component_id },
    });
    if (!component)
      return res.status(400).json({ message: "Invalid component_id" });

    const quote = SupplierQuoteRepository.create({
      supplier,
      component,
      price_per_unit,
      currency,
      valid_until,
      lead_time_days,
    });

    const saved = await SupplierQuoteRepository.save(quote);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const quote = await SupplierQuoteRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!quote) return res.status(404).json({ message: "Quote not found" });

    const { price_per_unit, currency, valid_until, lead_time_days } = req.body;

    quote.price_per_unit = price_per_unit ?? quote.price_per_unit;
    quote.currency = currency ?? quote.currency;
    quote.valid_until = valid_until ?? quote.valid_until;
    quote.lead_time_days = lead_time_days ?? quote.lead_time_days;

    const updated = await SupplierQuoteRepository.save(quote);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const quote = await SupplierQuoteRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!quote) return res.status(404).json({ message: "Quote not found" });

    await SupplierQuoteRepository.remove(quote);
    res.status(204).send();
  }) as RequestHandler,
};
