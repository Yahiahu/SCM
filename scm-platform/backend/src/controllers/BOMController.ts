import { Request, Response, RequestHandler } from "express";
import { BOMRepository } from "../repositories/BOMRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { ComponentRepository } from "../repositories/ComponentRepository";

export const BOMController = {
  getAll: (async (req: Request, res: Response) => {
    const entries = await BOMRepository.find({
      relations: ["product", "component"],
    });
    res.json(entries);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const entry = await BOMRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["product", "component"],
    });
    if (!entry) return res.status(404).json({ message: "BOM entry not found" });
    res.json(entry);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { product_id, component_id, required_qty } = req.body;

    const product = await ProductRepository.findOne({
      where: { id: product_id },
    });
    if (!product)
      return res.status(400).json({ message: "Invalid product_id" });

    const component = await ComponentRepository.findOne({
      where: { id: component_id },
    });
    if (!component)
      return res.status(400).json({ message: "Invalid component_id" });

    const bomEntry = BOMRepository.create({
      product,
      component,
      required_qty,
    });

    const saved = await BOMRepository.save(bomEntry);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { required_qty } = req.body;

    const entry = await BOMRepository.findOne({
      where: { id },
      relations: ["product", "component"],
    });
    if (!entry) return res.status(404).json({ message: "BOM entry not found" });

    entry.required_qty = required_qty ?? entry.required_qty;

    const updated = await BOMRepository.save(entry);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const existing = await BOMRepository.findOne({ where: { id } });
    if (!existing)
      return res.status(404).json({ message: "BOM entry not found" });

    await BOMRepository.remove(existing);
    res.status(204).send();
  }) as RequestHandler,
};
