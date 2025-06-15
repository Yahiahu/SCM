export interface Organization {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  organizationId: number;
  organization?: Organization; // Optional, assuming it's eager-loaded sometimes
  password_hash?: string; // Add if needed, but usually not sent to frontend
}

export interface Supplier {
  avg_lead_time_days: any;
  id: number;
  name: string;
  rating: number;
  contact_email: string;
  location: string;
  phone: string;
  historical_ontime_rate: number;
  avg_unit_cost: number;
  last_response_time: number;
  preferred: boolean;
}

export interface Component {
  last_order_date: string;
  current_stock: number;
  sku: string;
  preferred_supplier: any;
  lead_time_days: any;
  last_purchase_price: any;
  min_order_quantity: string;
  id: number;
  num: string;
  description: string;
  notes: string;
  supplier_part_number: string;
  supplierId: number;
  supplier?: Supplier;
  min_stock_level: number;
  supplierQuote?: SupplierQuote; // Optional, assuming eager loading
}

export interface Product {
  sku: any;
  id: number;
  name: string;
  description: string;
  qty: number;
  notes: string;
  organizationId: number;
  organization?: Organization; // Optional, assuming eager loading
}

export interface BOM {
  id: number;
  productId: number;
  componentId: number;
  required_qty: number;
  product?: Product; // Optional
  component?: Component; // Optional
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  organizationId: number;
  organization?: Organization; // Optional
}

export interface WarehouseInventory {
  product: any;
  product_id: number;
  id: number;
  warehouseId: number;
  componentId: number;
  current_qty: number;
  incoming_qty: number;
  outgoing_qty: number;
  warehouse?: Warehouse; // Optional
  component?: Component; // Optional
}

export interface POItem {
  id: number;
  poId: number;
  componentId: number;
  ordered_qty: number;
  received_qty: number;
  unit_cost: number;
  component?: Component; // Optional, assuming eager loading isn;t guaranteed
  purchaseOrder?: PurchaseOrder; // Optional
}

export interface PurchaseOrder {
  total_amount: any;
  product_id: number;
  id: number;
  supplierId: number;
  createdById: number;
  status: "Draft" | "Ordered" | "Received" | "Approved" | "Cancelled"; // Extend as per backend
  date_created: string; // ISO 8601 string
  date_expected: string; // ISO 8601 string
  date_received?: string; // Optional, ISO 8601 string
  supplier?: Supplier; // Optional
  createdBy?: User; // Optional
  poItems?: POItem[]; // Optional, assuming eager loading
  notes?: string; // Optional
}

export interface ShippingInfo {
  po: any;
  id: number;
  poId: number;
  componentId: number;
  qty: number;
  origin: string;
  destination: string;
  carrier: string;
  tracking_number?: string; // Optional, as it might be null
  estimated_arrival: string; // ISO 8601 string
  status: "In Transit" | "Delayed" | "Arrived" | "Processing"; // Extend as per backend
  component?: Component; // Optional
  purchaseOrder?: PurchaseOrder; // Optional, for nested supplier info
}

export interface SupplierQuote {
  id: number;
  supplierId: number;
  componentId: number;
  price_per_unit: number;
  currency: string;
  valid_until: string; // ISO 8601 string
  lead_time_days: number;
  supplier?: Supplier; // Optional
  component?: Component; // Optional
}

export interface ProductDemand {
  id: number;
  productId: number;
  month: number;
  year: number;
  qty: number;
  is_forecast: boolean;
  product?: Product; // Optional
}

export interface ComponentDemand {
  id: number;
  componentId: number;
  month: number;
  year: number;
  qty: number;
  is_forecast: boolean;
  component?: Component; // Optional
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  poId?: number; // Optional
  message_body: string;
  timestamp: string; // ISO 8601 string
  sender?: User; // Optional
  receiver?: User; // Optional
  purchaseOrder?: PurchaseOrder; // Optional
}

export interface MessageAttachment {
  id: number;
  messageId: number;
  file_url: string;
  file_type: string;
  chatMessage?: ChatMessage; // Optional
}

export interface POConversationThread {
  id: number;
  poId: number;
  title: string;
  createdById: number;
  created_at: string; // ISO 8601 string
  purchaseOrder?: PurchaseOrder; // Optional
  createdBy?: User; // Optional
}

export interface AuditLog {
  id: number;
  entity_type: string;
  entity_id: number;
  action_type: string;
  actorId: number;
  timestamp: string; // ISO 8601 string
  change_summary: string;
  actor?: User; // Optional
}

export interface MonthlyStock {
  qty_used: number;
  current_qty: any;
  id: number;
  warehouseId: number;
  month: number;
  year: number;
  percent_occupied: number;
  warehouse?: Warehouse; // Optional
}

export interface WarehouseLayout {
  id: number;
  warehouseId: number;
  layout_image_url: string;
  occupancy_json: string; // JSON string
  percent_occupied: number;
  warehouse?: Warehouse; // Optional
}

export interface SupplierPerformance {
  id: number;
  supplier_id: number;
  month: string; // ISO string or Date
  on_time_delivery_rate: number; // e.g., 0.95
  quality_rating: number; // e.g., 0.98
}

