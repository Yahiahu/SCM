import { Request, Response, RequestHandler } from "express";
import { ProductRepository } from "../repositories/ProductRepository";
import { OrganizationRepository } from "../repositories/OrganizationRepository";

export const ProductController = {
  getAll: (async (req: Request, res: Response) => {
    const products = await ProductRepository.find({
      relations: ["organization", "bom_entries", "demands"],
    });
    res.json(products);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const product = await ProductRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["organization", "bom_entries", "demands"],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const {
      name,
      description,
      qty,
      image_url,
      notes,
      design_files,
      warnings,
      organization_id,
    } = req.body;

    const org = await OrganizationRepository.findOne({
      where: { id: organization_id },
    });
    if (!org)
      return res.status(400).json({ message: "Invalid organization_id" });

    const product = ProductRepository.create({
      name,
      description,
      qty,
      image_url,
      notes,
      design_files,
      warnings,
      organization: org,
    });

    const saved = await ProductRepository.save(product);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const product = await ProductRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, qty, image_url, notes, design_files, warnings } =
      req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.qty = qty ?? product.qty;
    product.image_url = image_url ?? product.image_url;
    product.notes = notes ?? product.notes;
    product.design_files = design_files ?? product.design_files;
    product.warnings = warnings ?? product.warnings;

    const updated = await ProductRepository.save(product);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const product = await ProductRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    await ProductRepository.remove(product);
    res.status(204).send();
  }) as RequestHandler,
};
