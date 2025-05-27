import { Request, Response, RequestHandler } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { OrganizationRepository } from "../repositories/OrganizationRepository";

export const UserController = {
  getAll: (async (req: Request, res: Response) => {
    const users = await UserRepository.find({
      relations: ["organization"],
    });
    res.json(users);
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    const user = await UserRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["organization"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    const { username, password_hash, email, phone, role, organization_id } =
      req.body;

    const organization = await OrganizationRepository.findOne({
      where: { id: organization_id },
    });
    if (!organization)
      return res.status(400).json({ message: "Invalid organization_id" });

    const user = UserRepository.create({
      username,
      password_hash,
      email,
      phone,
      role,
      organization,
    });

    const saved = await UserRepository.save(user);
    res.status(201).json(saved);
  }) as RequestHandler,

  update: (async (req: Request, res: Response) => {
    const user = await UserRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, password_hash, email, phone, role } = req.body;

    user.username = username ?? user.username;
    user.password_hash = password_hash ?? user.password_hash;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.role = role ?? user.role;

    const updated = await UserRepository.save(user);
    res.json(updated);
  }) as RequestHandler,

  remove: (async (req: Request, res: Response) => {
    const user = await UserRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    await UserRepository.remove(user);
    res.status(204).send();
  }) as RequestHandler,
};
