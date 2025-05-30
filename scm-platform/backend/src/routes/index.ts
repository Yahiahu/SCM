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
import aiSuggestionRoutes from "./aisuggestion.routes"; // if this is meant to be used

const router = Router();

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

export default router;
