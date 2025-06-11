import { Router } from "express";

import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import auditLogRoutes from "./auditlog.routes";
import bomRoutes from "./bom.routes";
import chatMessageRoutes from "./chatmessage.routes";
import componentRoutes from "./component.routes";
import componentDemandRoutes from "./componentdemand.routes";
import messageAttachmentRoutes from "./messageattachment.routes";
import monthlyStockRoutes from "./monthlystock.routes";
import organizationRoutes from "./organization.routes";
import poItemRoutes from "./poitem.routes";
import productDemandRoutes from "./productdemand.routes";
import purchaseOrderRoutes from "./purchaseorder.routes";
import shippingInfoRoutes from "./shippinginfo.routes";
import supplierRoutes from "./supplier.routes";
import supplierQuoteRoutes from "./supplierquote.routes";
import warehouseRoutes from "./warehouse.routes";
import warehouseInventoryRoutes from "./warehouseinventory.routes";
import warehouseLayoutRoutes from "./warehouselayout.routes";
import aiSuggestionRoutes from "./aisuggestion.routes";
import poConversationThreadRoutes from "./poconversationthread.routes";
import financeRoutes from "./new/finance.routes";




// ✅ New Routes
import adminRoutes from "./new/admin.routes";
import alertRoutes from "./new/alert.routes";
import anomalyRoutes from "./new/anomaly.routes";
import automationRoutes from "./new/automationRule.routes";
import binLocationRoutes from "./new/binLocation.routes";
import goalRoutes from "./new/goal.routes";
import inventoryAuditRoutes from "./new/inventoryAudit.routes";
import inventoryBatchRoutes from "./new/inventoryBatch.routes";
import inventoryTransactionRoutes from "./new/inventoryTransaction.routes";
import inventoryValuationRoutes from "./new/inventoryValuation.routes";
import landedCostRoutes from "./new/landedCost.routes";
import purchaseGroupRoutes from "./new/purchaseGroup.routes";
import returnOrderRoutes from "./new/returnOrder.routes";
import rfqRoutes from "./new/rfq.routes";
import riskPredictionRoutes from "./new/riskprediction.routes";
import scenarioModelRoutes from "./new/scenariomodel.routes";
import supplierScoreRoutes from "./new/supplierscore.routes";
import taskRoutes from "./new/task.routes";
import invoiceRoutes from "./new/invoice.routes";
import paymentRoutes from "./new/payment.routes";

const router = Router();

// Legacy or shared routes
router.use("/users", userRoutes);
router.use("/product", productRoutes);
router.use("/auditlog", auditLogRoutes);
router.use("/bom", bomRoutes);
router.use("/chatmessage", chatMessageRoutes);
router.use("/component", componentRoutes);
router.use("/componentdemand", componentDemandRoutes);
router.use("/messageattachment", messageAttachmentRoutes);
router.use("/monthlystock", monthlyStockRoutes);
router.use("/organization", organizationRoutes);
router.use("/poitem", poItemRoutes);
router.use("/productdemand", productDemandRoutes);
router.use("/purchaseorder", purchaseOrderRoutes);
router.use("/shippinginfo", shippingInfoRoutes);
router.use("/supplier", supplierRoutes);
router.use("/supplierquote", supplierQuoteRoutes);
router.use("/warehouse", warehouseRoutes);
router.use("/warehouseinventory", warehouseInventoryRoutes);
router.use("/warehouselayout", warehouseLayoutRoutes);
router.use("/aisuggestion", aiSuggestionRoutes);
router.use("/poconversationthread", poConversationThreadRoutes);

// New structured routes
router.use("/alerts", alertRoutes);
router.use("/anomalies", anomalyRoutes);
router.use("/automationrules", automationRoutes);
router.use("/binlocations", binLocationRoutes);
router.use("/goals", goalRoutes);
router.use("/inventoryaudits", inventoryAuditRoutes);
router.use("/inventorybatches", inventoryBatchRoutes);
router.use("/inventorytransactions", inventoryTransactionRoutes);
router.use("/inventoryvaluations", inventoryValuationRoutes);
router.use("/landedcosts", landedCostRoutes);
router.use("/purchasegroups", purchaseGroupRoutes);
router.use("/returnorders", returnOrderRoutes);
router.use("/rfqs", rfqRoutes);
router.use("/riskpredictions", riskPredictionRoutes);
router.use("/scenariomodels", scenarioModelRoutes);
router.use("/supplierscores", supplierScoreRoutes);
router.use("/tasks", taskRoutes);
router.use("/admin", adminRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/finance", financeRoutes);


export default router;
