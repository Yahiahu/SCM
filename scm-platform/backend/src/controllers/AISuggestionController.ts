import { Request, Response, RequestHandler } from "express";
import { AISuggestionRepository } from "../repositories/AISuggestionRepository";
import { UserRepository } from "../repositories/UserRepository";

export const AISuggestionController = {
  getAll: (async (req: Request, res: Response) => {
    const suggestions = await AISuggestionRepository.find({
      relations: ["triggered_by"],
      order: { timestamp: "DESC" },
    });
    res.json(suggestions);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const suggestion = await AISuggestionRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["triggered_by"],
    });

    if (!suggestion)
      return res.status(404).json({ message: "Suggestion not found" });
    res.json(suggestion);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const {
      type,
      target_id,
      suggested_value,
      confidence_score,
      triggered_by_id,
    } = req.body;

    const suggestion = AISuggestionRepository.create({
      type,
      target_id,
      suggested_value,
      confidence_score,
    });

    if (triggered_by_id) {
      const user = await UserRepository.findOne({
        where: { id: triggered_by_id },
      });
      if (!user)
        return res.status(400).json({ message: "Invalid triggered_by_id" });
      suggestion.triggered_by = user;
    }

    const saved = await AISuggestionRepository.save(suggestion);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {
      type,
      target_id,
      suggested_value,
      confidence_score,
      triggered_by_id,
    } = req.body;

    const suggestion = await AISuggestionRepository.findOne({ where: { id } });
    if (!suggestion)
      return res.status(404).json({ message: "Suggestion not found" });

    suggestion.type = type ?? suggestion.type;
    suggestion.target_id = target_id ?? suggestion.target_id;
    suggestion.suggested_value = suggested_value ?? suggestion.suggested_value;
    suggestion.confidence_score =
      confidence_score ?? suggestion.confidence_score;

    if (triggered_by_id !== undefined) {
      const user = await UserRepository.findOne({
        where: { id: triggered_by_id },
      });
      suggestion.triggered_by = user ?? null;
    }

    const updated = await AISuggestionRepository.save(suggestion);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const existing = await AISuggestionRepository.findOne({ where: { id } });
    if (!existing)
      return res.status(404).json({ message: "Suggestion not found" });

    await AISuggestionRepository.remove(existing);
    res.status(204).send();
  }) as RequestHandler,
};
