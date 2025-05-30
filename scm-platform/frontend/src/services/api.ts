// src/services/api.ts (for your frontend Next.js application)

import {
  Organization,
  User,
  Supplier,
  Component,
  Product,
  BOM,
  Warehouse,
  WarehouseInventory,
  POItem,
  PurchaseOrder,
  ShippingInfo,
  SupplierQuote,
  ProductDemand,
  ComponentDemand,
  ChatMessage,
  MessageAttachment,
  POConversationThread,
  AuditLog,
  MonthlyStock,
  WarehouseLayout,
} from "../../../backend/src/interfaces/index"; // Import from the same directory for frontend types

const API_BASE_URL = "http://localhost:5001/api"; // This is your backend's root API URL

// --- Generic Fetch Function ---
async function fetchData<T>(url: string, errorMessage: string): Promise<T[]> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `${errorMessage}: ${errorData.message || response.statusText}`
    );
  }
  return response.json();
}

async function createData<T>(
  url: string,
  data: Partial<T>,
  errorMessage: string
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `${errorMessage}: ${errorData.message || response.statusText}`
    );
  }
  return response.json();
}

async function updateData<T>(
  url: string,
  data: Partial<T>,
  errorMessage: string
): Promise<T> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `${errorMessage}: ${errorData.message || response.statusText}`
    );
  }
  return response.json();
}

async function deleteData(url: string, errorMessage: string): Promise<void> {
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `${errorMessage}: ${errorData.message || response.statusText}`
    );
  }
}

// --- Organization APIs ---
export const fetchOrganizations = async (): Promise<Organization[]> =>
  fetchData<Organization>(
    `${API_BASE_URL}/organization`,
    "Failed to fetch organizations"
  );

// --- User APIs ---
export const fetchUsers = async (): Promise<User[]> =>
  fetchData<User>(`${API_BASE_URL}/users`, "Failed to fetch users");
export const createUser = async (userData: Partial<User>): Promise<User> =>
  createData<User>(`${API_BASE_URL}/users`, userData, "Failed to create user");
export const updateUser = async (
  id: number,
  userUpdate: Partial<User>
): Promise<User> =>
  updateData<User>(
    `${API_BASE_URL}/users/${id}`,
    userUpdate,
    `Failed to update user ${id}`
  );

export const deleteUser = async (id: number): Promise<void> =>
  deleteData(`${API_BASE_URL}/users/${id}`, `Failed to delete user ${id}`);

// --- Product APIs ---
export const fetchProducts = async (): Promise<Product[]> =>
  fetchData<Product>(`${API_BASE_URL}/product`, "Failed to fetch products");
export const createProduct = async (
  productData: Partial<Product>
): Promise<Product> =>
  createData<Product>(
    `${API_BASE_URL}/product`,
    productData,
    "Failed to create product"
  );
export const updateProduct = async (
  id: number,
  productUpdate: Partial<Product>
): Promise<Product> =>
  updateData<Product>(
    `${API_BASE_URL}/product/${id}`,
    productUpdate,
    `Failed to update product ${id}`
  );

export const deleteProduct = async (id: number): Promise<void> =>
  deleteData(`${API_BASE_URL}/product/${id}`, `Failed to delete product ${id}`);

// --- Component APIs ---
export const fetchComponents = async (): Promise<Component[]> =>
  fetchData<Component>(
    `${API_BASE_URL}/component`,
    "Failed to fetch components"
  );
export const createComponent = async (
  componentData: Partial<Component>
): Promise<Component> =>
  createData<Component>(
    `${API_BASE_URL}/component`,
    componentData,
    "Failed to create component"
  );
export const updateComponent = async (
  id: number,
  componentUpdate: Partial<Component>
): Promise<Component> =>
  updateData<Component>(
    `${API_BASE_URL}/component/${id}`,
    componentUpdate,
    `Failed to update component ${id}`
  );

export const deleteComponent = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/component/${id}`,
    `Failed to delete component ${id}`
  );

// --- BOM APIs ---
export const fetchBOMs = async (): Promise<BOM[]> =>
  fetchData<BOM>(`${API_BASE_URL}/bom`, "Failed to fetch BOMs");
export const createBOM = async (bomData: Partial<BOM>): Promise<BOM> =>
  createData<BOM>(`${API_BASE_URL}/bom`, bomData, "Failed to create BOM");
export const updateBOM = async (
  id: number,
  bomUpdate: Partial<BOM>
): Promise<BOM> =>
  updateData<BOM>(
    `${API_BASE_URL}/bom/${id}`,
    bomUpdate,
    `Failed to update BOM ${id}`
  );
export const deleteBOM = async (id: number): Promise<void> =>
  deleteData(`${API_BASE_URL}/bom/${id}`, `Failed to delete BOM ${id}`);

// --- Supplier APIs ---
export const fetchSuppliers = async (): Promise<Supplier[]> =>
  fetchData<Supplier>(`${API_BASE_URL}/supplier`, "Failed to fetch suppliers");
export const createSupplier = async (
  supplierData: Partial<Supplier>
): Promise<Supplier> =>
  createData<Supplier>(
    `${API_BASE_URL}/supplier`,
    supplierData,
    "Failed to create supplier"
  );
export const updateSupplier = async (
  id: number,
  supplierUpdate: Partial<Supplier>
): Promise<Supplier> =>
  updateData<Supplier>(
    `${API_BASE_URL}/supplier/${id}`,
    supplierUpdate,
    `Failed to update supplier ${id}`
  );
export const deleteSupplier = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/supplier/${id}`,
    `Failed to delete supplier ${id}`
  );

// --- Warehouse APIs ---
export const fetchWarehouses = async (): Promise<Warehouse[]> =>
  fetchData<Warehouse>(
    `${API_BASE_URL}/warehouse`,
    "Failed to fetch warehouses"
  );
export const createWarehouse = async (
  warehouseData: Partial<Warehouse>
): Promise<Warehouse> =>
  createData<Warehouse>(
    `${API_BASE_URL}/warehouse`,
    warehouseData,
    "Failed to create warehouse"
  );
export const updateWarehouse = async (
  id: number,
  warehouseUpdate: Partial<Warehouse>
): Promise<Warehouse> =>
  updateData<Warehouse>(
    `${API_BASE_URL}/warehouse/${id}`,
    warehouseUpdate,
    `Failed to update warehouse ${id}`
  );

export const deleteWarehouse = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/warehouse/${id}`,
    `Failed to delete warehouse ${id}`
  );

// --- Warehouse Inventory APIs ---
export const fetchWarehouseInventory = async (): Promise<
  WarehouseInventory[]
> =>
  fetchData<WarehouseInventory>(
    `${API_BASE_URL}/warehouseinventory`,
    "Failed to fetch warehouse inventory"
  );
export const createWarehouseInventory = async (
  inventoryData: Partial<WarehouseInventory>
): Promise<WarehouseInventory> =>
  createData<WarehouseInventory>(
    `${API_BASE_URL}/warehouseinventory`,
    inventoryData,
    "Failed to create warehouse inventory"
  );
export const updateWarehouseInventory = async (
  id: number,
  warehouseInventoryUpdate: Partial<WarehouseInventory>
): Promise<WarehouseInventory> =>
  updateData<WarehouseInventory>(
    `${API_BASE_URL}/warehouseinventory/${id}`,
    warehouseInventoryUpdate,
    `Failed to update warehouse inventory ${id}`
  );
export const deleteWarehouseInventory = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/warehouseinventory/${id}`,
    `Failed to delete warehouse inventory ${id}`
  );

// --- Purchase Order APIs ---
export const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> =>
  fetchData<PurchaseOrder>(
    `${API_BASE_URL}/purchaseorder`,
    "Failed to fetch purchase orders"
  );
export const createPurchaseOrder = async (
  poData: Partial<PurchaseOrder>
): Promise<PurchaseOrder> =>
  createData<PurchaseOrder>(
    `${API_BASE_URL}/purchaseorder`,
    poData,
    "Failed to create purchase order"
  );
export const updatePurchaseOrder = async (
  id: number,
  purchaseOrderUpdate: Partial<PurchaseOrder>
): Promise<PurchaseOrder> =>
  updateData<PurchaseOrder>(
    `${API_BASE_URL}/purchaseorder/${id}`,
    purchaseOrderUpdate,
    `Failed to update purchase order ${id}`
  );

export const deletePurchaseOrder = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/purchaseorder/${id}`,
    `Failed to delete purchase order ${id}`
  );

// --- PO Item APIs ---
export const fetchPOItems = async (): Promise<POItem[]> =>
  fetchData<POItem>(`${API_BASE_URL}/poitem`, "Failed to fetch PO items");
export const fetchPOItemsByPOId = async (poId: number): Promise<POItem[]> =>
  fetchData<POItem>(
    `${API_BASE_URL}/poitem?poId=${poId}`,
    `Failed to fetch PO items for PO ID ${poId}`
  );
export const createPOItem = async (
  poItemData: Partial<POItem>
): Promise<POItem> =>
  createData<POItem>(
    `${API_BASE_URL}/poitem`,
    poItemData,
    "Failed to create PO item"
  );
export const updatePOItem = async (
  id: number,
  poItemUpdate: Partial<POItem>
): Promise<POItem> =>
  updateData<POItem>(
    `${API_BASE_URL}/poitem/${id}`,
    poItemUpdate,
    `Failed to update PO item ${id}`
  );

export const deletePOItem = async (id: number): Promise<void> =>
  deleteData(`${API_BASE_URL}/poitem/${id}`, `Failed to delete PO item ${id}`);

// --- Shipping Info APIs ---
export const fetchShippingInfo = async (): Promise<ShippingInfo[]> =>
  fetchData<ShippingInfo>(
    `${API_BASE_URL}/shippinginfo`,
    "Failed to fetch shipping info"
  );
export const createShippingInfo = async (
  shippingInfoData: Partial<ShippingInfo>
): Promise<ShippingInfo> =>
  createData<ShippingInfo>(
    `${API_BASE_URL}/shippinginfo`,
    shippingInfoData,
    "Failed to create shipping info"
  );
export const updateShippingInfo = async (
  id: number,
  shippingInfoUpdate: Partial<ShippingInfo>
): Promise<ShippingInfo> =>
  updateData<ShippingInfo>(
    `${API_BASE_URL}/shippinginfo/${id}`,
    shippingInfoUpdate,
    `Failed to update shipping info ${id}`
  );
export const deleteShippingInfo = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/shippinginfo/${id}`,
    `Failed to delete shipping info ${id}`
  );

// --- Supplier Quote APIs ---
export const fetchSupplierQuotes = async (): Promise<SupplierQuote[]> =>
  fetchData<SupplierQuote>(
    `${API_BASE_URL}/supplierquote`,
    "Failed to fetch supplier quotes"
  );
export const createSupplierQuote = async (
  quoteData: Partial<SupplierQuote>
): Promise<SupplierQuote> =>
  createData<SupplierQuote>(
    `${API_BASE_URL}/supplierquote`,
    quoteData,
    "Failed to create supplier quote"
  );
export const updateSupplierQuote = async (
  id: number,
  supplierQuoteUpdate: Partial<SupplierQuote>
): Promise<SupplierQuote> =>
  updateData<SupplierQuote>(
    `${API_BASE_URL}/supplierquote/${id}`,
    supplierQuoteUpdate,
    `Failed to update supplier quote ${id}`
  );

export const deleteSupplierQuote = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/supplierquote/${id}`,
    `Failed to delete supplier quote ${id}`
  );

// --- Product Demand APIs ---
export const fetchProductDemand = async (): Promise<ProductDemand[]> =>
  fetchData<ProductDemand>(
    `${API_BASE_URL}/productdemand`,
    "Failed to fetch product demand"
  );
export const createProductDemand = async (
  demandData: Partial<ProductDemand>
): Promise<ProductDemand> =>
  createData<ProductDemand>(
    `${API_BASE_URL}/productdemand`,
    demandData,
    "Failed to create product demand"
  );
export const updateProductDemand = async (
  id: number,
  productDemandUpdate: Partial<ProductDemand>
): Promise<ProductDemand> =>
  updateData<ProductDemand>(
    `${API_BASE_URL}/productdemand/${id}`,
    productDemandUpdate,
    `Failed to update product demand ${id}`
  );

export const deleteProductDemand = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/productdemand/${id}`,
    `Failed to delete product demand ${id}`
  );

// --- Component Demand APIs ---
export const fetchComponentDemand = async (): Promise<ComponentDemand[]> =>
  fetchData<ComponentDemand>(
    `${API_BASE_URL}/componentdemand`,
    "Failed to fetch component demand"
  );
export const createComponentDemand = async (
  demandData: Partial<ComponentDemand>
): Promise<ComponentDemand> =>
  createData<ComponentDemand>(
    `${API_BASE_URL}/componentdemand`,
    demandData,
    "Failed to create component demand"
  );
export const updateComponentDemand = async (
  id: number,
  componentDemandUpdate: Partial<ComponentDemand>
): Promise<ComponentDemand> =>
  updateData<ComponentDemand>(
    `${API_BASE_URL}/componentdemand/${id}`,
    componentDemandUpdate,
    `Failed to update component demand ${id}`
  );

export const deleteComponentDemand = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/componentdemand/${id}`,
    `Failed to delete component demand ${id}`
  );

// --- Chat Message APIs ---
export const fetchChatMessages = async (): Promise<ChatMessage[]> =>
  fetchData<ChatMessage>(
    `${API_BASE_URL}/chatmessage`,
    "Failed to fetch chat messages"
  );
export const createChatMessage = async (
  messageData: Partial<ChatMessage>
): Promise<ChatMessage> =>
  createData<ChatMessage>(
    `${API_BASE_URL}/chatmessage`,
    messageData,
    "Failed to create chat message"
  );
export const updateChatMessage = async (
  id: number,
  messageUpdate: Partial<ChatMessage>
): Promise<ChatMessage> =>
  updateData<ChatMessage>(
    `${API_BASE_URL}/chatmessage/${id}`,
    messageUpdate,
    `Failed to update chat message ${id}`
  );

export const deleteChatMessage = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/chatmessage/${id}`,
    `Failed to delete chat message ${id}`
  );

// --- Message Attachment APIs ---
export const fetchMessageAttachments = async (): Promise<MessageAttachment[]> =>
  fetchData<MessageAttachment>(
    `${API_BASE_URL}/messageattachment`,
    "Failed to fetch message attachments"
  );
export const createMessageAttachment = async (
  attachmentData: Partial<MessageAttachment>
): Promise<MessageAttachment> =>
  createData<MessageAttachment>(
    `${API_BASE_URL}/messageattachment`,
    attachmentData,
    "Failed to create message attachment"
  );
export const deleteMessageAttachment = async (id: number): Promise<void> =>
  deleteData(
    `${API_BASE_URL}/messageattachment/${id}`,
    `Failed to delete message attachment ${id}`
  );

// --- Audit Log APIs ---
export const fetchAuditLogs = async (): Promise<AuditLog[]> =>
  fetchData<AuditLog>(`${API_BASE_URL}/auditlog`, "Failed to fetch audit logs");

// --- Monthly Stock APIs ---
export const fetchMonthlyStock = async (): Promise<MonthlyStock[]> =>
  fetchData<MonthlyStock>(
    `${API_BASE_URL}/monthlystock`,
    "Failed to fetch monthly stock"
  );

// --- Warehouse Layout APIs ---
export const fetchWarehouseLayouts = async (): Promise<WarehouseLayout[]> =>
  fetchData<WarehouseLayout>(
    `${API_BASE_URL}/warehouselayout`,
    "Failed to fetch warehouse layouts"
  );