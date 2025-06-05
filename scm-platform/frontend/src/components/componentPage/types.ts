export interface Component {
  id: string;
  num: string;
  description: string;
  notes?: string;
  supplierPartNumber: string;
  supplierId: number;
  currentQty: number;
  status?: "In Stock" | "Low Stock" | "Out of Stock";
  type?: string;
  supplier?: string;
  lastUpdated?: string;
}

export type SortByOption = "name" | "type" | "quantity" | "status";
