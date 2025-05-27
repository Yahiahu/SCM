import { Request, Response, RequestHandler } from "express";
import { OrganizationRepository } from "../repositories/OrganizationRepository";

export const OrganizationController = {
  getAll: (async (req: Request, res: Response) => {
    const organizations = await OrganizationRepository.find({
      relations: ["users", "products", "warehouses"],
    });
    res.json(organizations);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const organization = await OrganizationRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["users", "products", "warehouses"],
    });
    if (!organization)
      return res.status(404).json({ message: "Organization not found" });
    res.json(organization);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { name } = req.body;

    const existing = await OrganizationRepository.findOne({ where: { name } });
    if (existing)
      return res
        .status(400)
        .json({ message: "Organization name already exists" });

    const organization = OrganizationRepository.create({ name });
    const saved = await OrganizationRepository.save(organization);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const org = await OrganizationRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    const { name } = req.body;
    org.name = name ?? org.name;

    const updated = await OrganizationRepository.save(org);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const org = await OrganizationRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    await OrganizationRepository.remove(org);
    res.status(204).send();
  }) as RequestHandler,
};
