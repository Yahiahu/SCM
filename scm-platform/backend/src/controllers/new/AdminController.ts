import { Request, Response } from "express";
import { AppDataSource } from "../../data-source"; // adjust the path
import { User } from "../../entities/User";
import { PurchaseOrder } from "../../entities/PurchaseOrder";
import { BOM } from "../../entities/BOM";
import { AnomalyLog } from "../../entities/new/AnomalyLog";
import { AISuggestion } from "../../entities/AISuggestion";
import { Organization } from "../../entities/Organization";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);
    const poRepo = AppDataSource.getRepository(PurchaseOrder);
    const bomRepo = AppDataSource.getRepository(BOM);
    const anomalyRepo = AppDataSource.getRepository(AnomalyLog);
    const aiRepo = AppDataSource.getRepository(AISuggestion);

    const totalUsers = await userRepo.count();
    const activeOrganizations = await orgRepo.count();

    const purchaseOrders = await poRepo.find();
    const totalPurchaseOrders = purchaseOrders.length;
    const outstandingPurchaseOrders = purchaseOrders.filter(
      (po) => !po.isCompleted
    ).length;
    const totalPurchaseOrderValue = purchaseOrders.reduce(
      (sum, po) => sum + (po.totalValue || 0),
      0
    );

    const totalBOMs = await bomRepo.count();
    const activeBOMs = await bomRepo.count();

    const anomalies = await anomalyRepo.find();
    const totalAnomalies = anomalies.length;
    const criticalAnomalies = totalAnomalies;

    const openSuggestions = await aiRepo.count();

    res.json({
      totalUsers,
      activeOrganizations,
      totalPurchaseOrders,
      outstandingPurchaseOrders,
      totalPurchaseOrderValue,
      shipmentsInTransit: 0,
      totalDeliveredShipments: 0,
      totalReturnOrders: 0,
      totalBOMs,
      activeBOMs,
      totalWorkOrders: 0,
      workOrdersInProgress: 0,
      workOrdersCompleted: 0,
      totalAnomalies,
      criticalAnomalies,
      openSuggestions,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};
