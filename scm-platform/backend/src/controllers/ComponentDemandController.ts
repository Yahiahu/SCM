import { Request, Response, RequestHandler } from "express";
import { ComponentDemandRepository } from "../repositories/ComponentDemandRepository";
import { ComponentRepository } from "../repositories/ComponentRepository";

export const ComponentDemandController = {
  getAll: (async (req: Request, res: Response) => {
    const records = await ComponentDemandRepository.find({
      relations: ["component"],
      order: { year: "DESC", month: "DESC" },
    });
    res.json(records);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const record = await ComponentDemandRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["component"],
    });
    if (!record)
      return res.status(404).json({ message: "Component demand not found" });
    res.json(record);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { component_id, month, year, qty, is_forecast } = req.body;

    const component = await ComponentRepository.findOne({
      where: { id: component_id },
    });
    if (!component)
      return res.status(400).json({ message: "Invalid component_id" });

    const record = ComponentDemandRepository.create({
      component,
      month,
      year,
      qty,
      is_forecast,
    });

    const saved = await ComponentDemandRepository.save(record);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const record = await ComponentDemandRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Component demand not found" });

    const { month, year, qty, is_forecast } = req.body;

    record.month = month ?? record.month;
    record.year = year ?? record.year;
    record.qty = qty ?? record.qty;
    record.is_forecast = is_forecast ?? record.is_forecast;

    const updated = await ComponentDemandRepository.save(record);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const record = await ComponentDemandRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!record)
      return res.status(404).json({ message: "Component demand not found" });

    await ComponentDemandRepository.remove(record);
    res.status(204).send();
  }) as RequestHandler,
};
