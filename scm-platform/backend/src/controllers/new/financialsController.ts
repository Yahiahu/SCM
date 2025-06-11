// src/controllers/finance.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Invoice } from "../../entities/new/invoice";
import { Payment } from "../../entities/new/payments";
import { Between, MoreThan } from "typeorm";

export const getFinancialSummary = async (_req: Request, res: Response) => {
  const invoiceRepo = AppDataSource.getRepository(Invoice);
  const paymentRepo = AppDataSource.getRepository(Payment);

  const [incomingPayments, outgoingPayments] = await Promise.all([
    paymentRepo.findBy({ type: "Incoming" }),
    paymentRepo.findBy({ type: "Outgoing" }),
  ]);

  const totalRevenueYTD = incomingPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const totalExpensesYTD = outgoingPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const currentCashBalance = totalRevenueYTD - totalExpensesYTD;

  const invoices = await invoiceRepo.find();
  const totalOutstandingInvoices = invoices.reduce(
    (sum, inv) => sum + inv.balanceDue,
    0
  );
  const overdueInvoicesCount = invoices.filter(
    (inv) => inv.status === "Overdue"
  ).length;

  const paymentDelays: number[] = [];
  for (const payment of incomingPayments) {
    if (payment.invoice?.issueDate) {
      const issueDate = new Date(payment.invoice.issueDate).getTime();
      const paidDate = new Date(payment.paymentDate).getTime();
      const days = (paidDate - issueDate) / (1000 * 60 * 60 * 24);
      if (days > 0) paymentDelays.push(days);
    }
  }
  const averagePaymentDays = paymentDelays.length
    ? Math.round(
        paymentDelays.reduce((a, b) => a + b, 0) / paymentDelays.length
      )
    : 0;

  res.json({
    totalOutstandingInvoices,
    totalRevenueYTD,
    totalExpensesYTD,
    currentCashBalance,
    overdueInvoicesCount,
    averagePaymentDays,
  });
};

export const getCashFlow = async (_req: Request, res: Response) => {
  const paymentRepo = AppDataSource.getRepository(Payment);
  const payments = await paymentRepo.find();

  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  for (const p of payments) {
    const month = new Date(p.paymentDate).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenses: 0 };
    }
    if (p.type === "Incoming") {
      monthlyData[month].income += p.amount;
    } else {
      monthlyData[month].expenses += p.amount;
    }
  }

  const cashFlowData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
    net: data.income - data.expenses,
  }));

  res.json(cashFlowData);
};






