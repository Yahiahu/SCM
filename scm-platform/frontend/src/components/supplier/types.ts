// types.ts
export interface Supplier {
  id: string;
  name: string;
  contact_email: string;
  phone: string;
  location: string;
  rating: number;
  historical_ontime_rate: number;
  avg_unit_cost: number;
  last_response_time: number;
  preferred: boolean;
  status: "Active" | "Inactive" | "On Hold";
  components_supplied?: number;
  last_order_date?: string;
}

export type SortOption = "name" | "rating" | "ontime" | "status" | "last_order";
