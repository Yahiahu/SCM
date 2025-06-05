import { FiCheckCircle, FiAlertTriangle, FiClock } from "react-icons/fi";
import { Component } from "./types"; // Assuming you still use this somewhere else

export const getSupplierName = (supplierId: number) => {
  const suppliers = [
    { id: 1, name: "Alpha Components" },
    { id: 2, name: "Beta Electronics" },
    { id: 3, name: "Gamma Mechanical" },
    { id: 4, name: "Delta Materials" },
  ];
  return suppliers.find((s) => s.id === supplierId)?.name || "Unknown Supplier";
};

export const getComponentType = (description: string) => {
  if (description.includes("Resistor")) return "Electrical";
  if (description.includes("Capacitor")) return "Electrical";
  if (description.includes("Bolt")) return "Hardware";
  if (description.includes("CPU")) return "Electronics";
  if (description.includes("Case")) return "Housing";
  return "Other";
};

export const getStatus = (
  quantity: number
): "In Stock" | "Low Stock" | "Out of Stock" => {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 10) return "Low Stock";
  return "In Stock";
};

export const getStatusIcon = (status: string): JSX.Element | null => {
  switch (status) {
    case "In Stock":
      // Using direct FiCheckCircle with Tailwind classes for color
      return <FiCheckCircle className="text-emerald-500" />;
    case "Low Stock":
      // Using direct FiAlertTriangle with Tailwind classes for color
      return <FiAlertTriangle className="text-amber-500" />;
    case "Out of Stock":
      // Using direct FiClock with Tailwind classes for color
      return <FiClock className="text-red-500" />;
    default:
      return null;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "green";
    case "Low Stock":
      return "orange";
    case "Out of Stock":
      return "red";
    default:
      return "gray";
  }
};
