// src/controllers/payment.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Payment } from "../../entities/new/payments";

const paymentRepo = AppDataSource.getRepository(Payment);

export const getAllPayments = async (_req: Request, res: Response) => {
  const payments = await paymentRepo.find({ relations: ["invoice"] });
  res.json(payments);
};

export const createPayment = async (req: Request, res: Response) => {
  const payment = paymentRepo.create(req.body);
  await paymentRepo.save(payment);
  res.status(201).json(payment);
};
