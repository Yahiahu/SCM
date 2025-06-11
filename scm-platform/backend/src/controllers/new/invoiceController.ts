// src/controllers/invoice.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Invoice } from "../../entities/new/invoice";

const invoiceRepo = AppDataSource.getRepository(Invoice);

export const getAllInvoices = async (_req: Request, res: Response) => {
  const invoices = await invoiceRepo.find({ relations: ["payments"] });
  res.json(invoices);
};

export const createInvoice = async (req: Request, res: Response) => {
  const invoice = invoiceRepo.create(req.body);
  await invoiceRepo.save(invoice);
  res.status(201).json(invoice);
};
