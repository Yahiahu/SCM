import { Request, Response, RequestHandler } from "express";
import { ComponentRepository } from "../repositories/ComponentRepository";
import { SupplierRepository } from "../repositories/SupplierRepository";

export const ComponentController = {
  getAll: (async (req: Request, res: Response) => {
    const components = await ComponentRepository.find({
      relations: ["supplier"],
    });
    res.json(components);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const component = await ComponentRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["supplier"],
    });
    if (!component)
      return res.status(404).json({ message: "Component not found" });
    res.json(component);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        num, description, notes, image_url, supplier_part_number, supplier_id,
      } = req.body;

      // Log incoming data to debug
      console.log("Creating component with body:", req.body);

      // Required field validation
      if (!num || !description || !supplier_part_number || !supplier_id) {
        return res
          .status(400)
          .json({ message: "Missing required fields for component creation." });
      }

      // Build component without id
      const component = ComponentRepository.create({
        num,
        description,
        notes,
        image_url,
        supplier_part_number,
      });

      // Resolve supplier
      const supplier = await SupplierRepository.findOne({
        where: { id: supplier_id },
      });

      if (!supplier) {
        return res.status(400).json({ message: "Invalid supplier_id" });
      }

      component.supplier = supplier;

      const saved = await ComponentRepository.save(component);
      return res.status(201).json(saved);
    } catch (error) {
      console.error("Component creation error:", error);
      return res.status(500).json({ message: "Failed to create component." });
    }
  }) as unknown as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const component = await ComponentRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!component)
      return res.status(404).json({ message: "Component not found" });

    const {
      num,
      description,
      notes,
      image_url,
      supplier_part_number,
      supplier_id,
    } = req.body;

    component.num = num ?? component.num;
    component.description = description ?? component.description;
    component.notes = notes ?? component.notes;
    component.image_url = image_url ?? component.image_url;
    component.supplier_part_number =
      supplier_part_number ?? component.supplier_part_number;

    if (supplier_id !== undefined) {
      const supplier = await SupplierRepository.findOne({
        where: { id: supplier_id },
      });
      component.supplier = supplier ?? null;
    }

    const updated = await ComponentRepository.save(component);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const existing = await ComponentRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!existing)
      return res.status(404).json({ message: "Component not found" });

    await ComponentRepository.remove(existing);
    res.status(204).send();
  }) as RequestHandler,
};
