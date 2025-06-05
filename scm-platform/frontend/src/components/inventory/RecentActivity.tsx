import { FiTrendingUp } from "react-icons/fi";
import { PurchaseOrder, ShippingInfo, WarehouseInventory } from "./types";

interface RecentActivityProps {
  purchaseOrders: PurchaseOrder[];
  shipments: ShippingInfo[];
  inventory: WarehouseInventory[];
}

export const RecentActivity = ({
  purchaseOrders,
  shipments,
  inventory,
}: RecentActivityProps) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formatToDateString = (date: Date) => date.toDateString();

  const newOrdersToday = purchaseOrders.filter(
    (po) =>
      po.date_created &&
      formatToDateString(new Date(po.date_created)) ===
        formatToDateString(today)
  ).length;

  const shipmentsDeliveredToday = shipments.filter(
    (s) =>
      s.status === "Delivered" &&
      s.deliveryDate &&
      formatToDateString(new Date(s.deliveryDate)) === formatToDateString(today)
  ).length;

  const inventoryUpdatesYesterday = inventory.filter(
    (i) =>
      i.lastUpdated &&
      formatToDateString(new Date(i.lastUpdated)) ===
        formatToDateString(yesterday)
  ).length;

  const delayedShipmentsYesterday = shipments.filter(
    (s) =>
      s.status === "Delayed" &&
      s.statusDate &&
      formatToDateString(new Date(s.statusDate)) ===
        formatToDateString(yesterday)
  ).length;

  return (
    <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-r from-blue-500/10 to-sky-500/10 border-b border-sky-200/50">
        <div className="flex items-center gap-3">
          <FiTrendingUp className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="flex flex-col space-y-5">
          {/* Today's Activity */}
          <div>
            <p className="font-bold text-sky-800 mb-2">Today</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              &bull; {newOrdersToday} new orders created
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              &bull; {shipmentsDeliveredToday} shipments delivered
            </p>
          </div>
          {/* Yesterday's Activity */}
          <div>
            <p className="font-bold text-sky-800 mb-2">Yesterday</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              &bull; {inventoryUpdatesYesterday} inventory updates
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              &bull; {delayedShipmentsYesterday} delayed shipments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
