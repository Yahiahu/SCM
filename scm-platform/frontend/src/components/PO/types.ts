export interface Vendor {
  id: number;
  name: string;
  contact: string;
  rating: number;
}

export interface POItem {
  id: number;
  component: {
    id: number;
    name: string;
  };
  quantity: number;
  unitPrice: number;
  total: number;
}


export interface PurchaseOrder {
  id: number;
  poNumber: string;
  vendor: Vendor;
  items: POItem[];
  totalAmount: number;
  dateCreated: string;
  dateDue: string;
  status:
    | "Draft"
    | "Submitted"
    | "Approved"
    | "Ordered"
    | "Delivered"
    | "Paid"
    | "Cancelled";
  paymentStatus: "Unpaid" | "Partially Paid" | "Fully Paid";
  assignedTo: string;
  notes: string;
}

// Backend interfaces
export interface BackendPurchaseOrder {
  id: number;
  supplierId: number;
  date_created: string;
  date_expected: string;
  createdById: number;
  status: "Draft" | "Approved" | "Ordered" | "Received" | "Cancelled";
  notes?: string;
}

export interface BackendSupplier {
  id: number;
  name: string;
  contact_email: string;
  rating: number;
}

export interface BackendUser {
  id: number;
  username: string;
}

export interface BackendPOItem {
  id: number;
  component: {
    description: string;
  };
  ordered_qty: number;
  unit_cost: number;
}
