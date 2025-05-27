import { Request, Response, RequestHandler } from "express";
import { MonthlyStockRepository } from "../repositories/MonthlyStockRepository";
import { WarehouseRepository } from "../repositories/WarehouseRepository";

export const MonthlyStockController = {
  getAll: (async (req: Request, res: Response) => {
    const records = await MonthlyStockRepository.find({
      relations: ["warehouse"],
    });
    res.json(records);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const record = await MonthlyStockRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["warehouse"],
    });
    if (!record)
      return res
        .status(404)
        .json({ message: "Monthly stock record not found" });
    res.json(record);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { warehouse_id, month, year, percent_occupied } = req.body;

    const warehouse = await WarehouseRepository.findOne({
      where: { id: warehouse_id },
    });
    if (!warehouse)
      return res.status(400).json({ message: "Invalid warehouse_id" });

    const record = MonthlyStockRepository.create({
      warehouse,
      month,
      year,
      percent_occupied,
    });

    const saved = await MonthlyStockRepository.save(record);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const record = await MonthlyStockRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res
        .status(404)
        .json({ message: "Monthly stock record not found" });

    const { month, year, percent_occupied } = req.body;

    record.month = month ?? record.month;
    record.year = year ?? record.year;
    record.percent_occupied = percent_occupied ?? record.percent_occupied;

    const updated = await MonthlyStockRepository.save(record);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const record = await MonthlyStockRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res
        .status(404)
        .json({ message: "Monthly stock record not found" });

    await MonthlyStockRepository.remove(record);
    res.status(204).send();
  }) as RequestHandler,
};
