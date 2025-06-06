// Define all your interfaces and types here
export interface InventoryItem {
  id: number;
  componentId: number;
  warehouseId: number;
  currentQty: number;
  incomingQty: number;
  outgoingQty: number;
  component: {
    num: string;
    description: string;
    supplierPartNumber: string;
    supplier: {
      name: string;
    };
  };
  warehouse: {
    name: string;
    location: string;
  };
}

export interface IncomingShipment {
  id: number;
  poId: number;
  componentId: number;
  qty: number;
  origin: string;
  destination: string;
  carrier: string;
  trackingNumber: string;
  estimatedArrival: string;
  status: "In Transit" | "Delayed" | "Arrived" | "Processing";
  component: {
    description: string;
  };
  purchaseOrder: {
    supplier: {
      name: string;
    };
  };
}

export interface OutgoingShipment {
  id: number;
  poId: number;
  componentId: number;
  qty: number;
  to: string;
  orderNumber: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingDate: string;
  trackingNumber?: string;
  component: {
    description: string;
  };
}

export interface WarehouseLocation {
  id: number;
  name: string;
  location: string;
  organizationId: number;
  capacity?: number;
  currentOccupancy?: number;
}
