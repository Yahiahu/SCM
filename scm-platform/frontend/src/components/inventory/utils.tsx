import { FiCheckCircle, FiAlertTriangle, FiClock } from "react-icons/fi";
import { WarehouseInventory } from "./types";

/**
 * Returns a color string based on the status, suitable for Tailwind CSS class mapping.
 * @param status The status string (e.g., "Received", "Ordered", "Delayed").
 * @returns A string representing a color (e.g., "green", "orange", "red", "gray").
 */
export const getStatusColor = (
  status: string
): "green" | "orange" | "red" | "gray" => {
  switch (status) {
    case "Received":
    case "Delivered":
      return "green";
    case "Ordered":
    case "In Transit":
      return "orange";
    case "Draft":
    case "Delayed":
      return "red";
    default:
      return "gray";
  }
};

/**
 * Returns a React Feather icon component based on the status.
 * @param status The status string (e.g., "Received", "Ordered", "Delayed").
 * @returns A JSX.Element (React Feather icon) or null if no matching icon.
 */
export const getStatusIcon = (status: string): JSX.Element | null => {
  // You can customize icon sizes and colors here if they need to be consistent across badges
  // For dynamic colors, you'd pass the Tailwind class in the component consuming this.
  const iconProps = { className: "w-3 h-3" }; // Example default size, adjust as needed

  switch (status) {
    case "Received":
    case "Delivered":
      return <FiCheckCircle {...iconProps} />;
    case "Ordered":
    case "In Transit":
      return <FiAlertTriangle {...iconProps} />;
    case "Draft":
    case "Delayed":
      return <FiClock {...iconProps} />;
    default:
      return null;
  }
};

/**
 * Calculates the total value of the inventory based on predefined unit prices.
 * @param inventory An array of WarehouseInventory items.
 * @returns The total calculated inventory value.
 */
export const calculateInventoryValue = (
  inventory: WarehouseInventory[]
): number => {
  const unitPrices: Record<string, number> = {
    "CMP-001-RES": 0.05,
    "CMP-002-CAP": 0.15,
    "CMP-003-BOLT": 0.25,
    "CMP-004-CASE": 5.2,
    "CMP-005-CPU": 15.75,
    // Add more component prices as needed
  };

  return inventory.reduce((sum, item) => {
    // Fallback to a default price (e.g., 10) if the component's unit price isn't found
    const price = unitPrices[item.component?.num || ""] || 10;
    return sum + item.current_qty * price;
  }, 0);
};
