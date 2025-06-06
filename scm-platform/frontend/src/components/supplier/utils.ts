// utils.ts
import { Supplier } from "./types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "green";
    case "Inactive": return "gray";
    case "On Hold": return "orange";
    default: return "gray";
  }
};

export const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "green";
  if (rating >= 3.5) return "blue";
  if (rating >= 2.5) return "orange";
  return "red";
};

export const calculateMetrics = (suppliers: Supplier[]) => {
  const totalSuppliers = suppliers.length;
  const preferredSuppliers = suppliers.filter((s) => s.preferred).length;
  const avgRating = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length)
    : 0;
  const avgOnTimeRate = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.historical_ontime_rate, 0) / suppliers.length)
    : 0;
  const avgResponseTime = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.last_response_time, 0) / suppliers.length)
    : 0;

  return {
    totalSuppliers,
    preferredSuppliers,
    avgRating: avgRating.toFixed(1),
    avgOnTimeRate: (avgOnTimeRate * 100).toFixed(1),
    avgResponseTime: avgResponseTime.toFixed(1)
  };
};