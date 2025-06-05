import {
  FiAlertCircle,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import { PurchaseOrder, ShippingInfo, WarehouseInventory } from "./types";
import { calculateInventoryValue } from "./utils"; // Assuming this utility function is already pure JS/TS

interface LogisticsStatsProps {
  purchaseOrders: PurchaseOrder[];
  shipments: ShippingInfo[];
  inventory: WarehouseInventory[];
}

export const LogisticsStats = ({
  purchaseOrders,
  shipments,
  inventory,
}: LogisticsStatsProps) => {
  const inventoryValue = calculateInventoryValue(inventory);
  const itemsNeedingReorder = inventory.filter(
    (item) => item.current_qty < 10
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Inventory Value Card */}
      <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm p-6">
        <p className="text-sm font-medium text-sky-700 mb-2">
          Total Inventory Value
        </p>
        <div className="text-3xl font-bold text-sky-900 mb-1">
          ${inventoryValue.toLocaleString()}
        </div>
        <div className="flex items-center text-xs text-sky-600">
          <FiArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
          <span className="font-semibold text-emerald-600">12%</span> from last
          month
        </div>
      </div>

      {/* Pending Orders Card */}
      <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm p-6">
        <p className="text-sm font-medium text-sky-700 mb-2">Pending Orders</p>
        <div className="text-3xl font-bold text-sky-900 mb-1">
          {purchaseOrders.filter((po) => po.status === "Ordered").length}
        </div>
        <div className="flex items-center text-xs text-sky-600">
          <FiArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          <span className="font-semibold text-red-600">5%</span> from last month
        </div>
      </div>

      {/* Items Needing Reorder Card */}
      <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm p-6">
        <p className="text-sm font-medium text-sky-700 mb-2">
          Items Needing Reorder
        </p>
        <div
          className={`text-3xl font-bold mb-1 ${
            itemsNeedingReorder > 0 ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {itemsNeedingReorder}
        </div>
        <div
          className={`flex items-center text-xs ${
            itemsNeedingReorder > 0 ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {itemsNeedingReorder > 0 ? (
            <div className="flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              <span className="font-semibold">Action needed</span>
            </div>
          ) : (
            <div className="flex items-center">
              <FiCheckCircle className="w-4 h-4 mr-1" />
              <span className="font-semibold">All stocked</span>
            </div>
          )}
        </div>
      </div>

      {/* In Transit Shipments Card */}
      <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm p-6">
        <p className="text-sm font-medium text-sky-700 mb-2">
          In Transit Shipments
        </p>
        <div className="text-3xl font-bold text-sky-900 mb-1">
          {shipments.filter((s) => s.status === "In Transit").length}
        </div>
        <div className="flex items-center text-xs text-sky-600">
          <FiArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
          <span className="font-semibold text-emerald-600">3</span> new
          shipments today
        </div>
      </div>
    </div>
  );
};
