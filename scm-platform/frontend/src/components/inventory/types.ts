export interface PurchaseOrder {
  id: number;
  status: "Draft" | "Ordered" | "Received";
  date_created: string;
  date_expected?: string;
  date_received?: string;
  supplier: {
    name: string;
  };
  createdBy: {
    username: string;
  };
  items: {
    component: {
      num: string;
      description: string;
    };
    ordered_qty: number;
    received_qty: number;
  }[];
}

export interface ShippingInfo {
  deliveryDate?: string | number | Date;
  statusDate?: string | number | Date;
  id: number;
  status: "Processing" | "In Transit" | "Delivered" | "Delayed";
  estimated_arrival: string;
  carrier: string;
  tracking_number: string;
  origin: string;
  destination: string;
  component: {
    num: string;
    description: string;
  };
  qty: number;
}

export interface WarehouseInventory {
  lastUpdated?: string | number | Date;
  id: number;
  current_qty: number;
  incoming_qty: number;
  outgoing_qty: number;
  component: {
    num: string;
    description: string;
  };
  warehouse: {
    name: string;
    location: string;
  };
}
