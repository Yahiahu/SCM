import { Request, Response, RequestHandler } from "express";
import { ProductDemandRepository } from "../repositories/ProductDemandRepository";
import { ProductRepository } from "../repositories/ProductRepository";

export const ProductDemandController = {
  getAll: (async (req: Request, res: Response) => {
    const records = await ProductDemandRepository.find({
      relations: ["product"],
    });
    res.json(records);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const record = await ProductDemandRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["product"],
    });
    if (!record)
      return res.status(404).json({ message: "Product demand not found" });
    res.json(record);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { product_id, month, year, qty, is_forecast } = req.body;

    const product = await ProductRepository.findOne({
      where: { id: product_id },
    });
    if (!product)
      return res.status(400).json({ message: "Invalid product_id" });

    const record = ProductDemandRepository.create({
      product,
      month,
      year,
      qty,
      is_forecast,
    });

    const saved = await ProductDemandRepository.save(record);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const record = await ProductDemandRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Product demand not found" });

    const { month, year, qty, is_forecast } = req.body;

    record.month = month ?? record.month;
    record.year = year ?? record.year;
    record.qty = qty ?? record.qty;
    record.is_forecast = is_forecast ?? record.is_forecast;

    const updated = await ProductDemandRepository.save(record);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const record = await ProductDemandRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Product demand not found" });

    await ProductDemandRepository.remove(record);
    res.status(204).send();
  }) as RequestHandler,
};
