import { FiHome } from "react-icons/fi";
import { WarehouseInventory } from "./types";
import { getStatusIcon } from "./utils"; // Assuming getStatusIcon is now a pure JS/TS function

interface WarehouseTableProps {
  inventory: WarehouseInventory[];
  isLoading: boolean;
  // getStatusColor and getStatusIcon are now expected to be imported from utils,
  // so they are not needed as props here.
}

export const WarehouseTable = ({
  inventory,
  isLoading,
}: WarehouseTableProps) => {
  // Helper to determine inventory status text
  const getInventoryStatusText = (qty: number) => {
    if (qty > 20) return "In Stock";
    if (qty > 0) return "Low Stock";
    return "Out of Stock";
  };

  // Helper to determine Tailwind color classes based on quantity
  const getInventoryStatusColorClass = (qty: number) => {
    if (qty > 20) return "bg-emerald-100 text-emerald-800";
    if (qty > 0) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-b border-sky-200/50">
        <div className="flex items-center gap-3">
          <FiHome className="w-6 h-6 text-sky-700" />
          <h2 className="text-xl font-bold text-gray-800">Warehouse</h2>
        </div>
      </div>

      {/* Card Body with Table or Skeleton */}
      <div className="p-0">
        {isLoading ? (
          <div className="p-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-sky-100/70 rounded-lg mb-2 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-200/50">
              <thead className="bg-sky-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Component
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/70 divide-y divide-sky-100/50">
                {inventory.slice(0, 5).map((item) => {
                  const statusText = getInventoryStatusText(item.current_qty);
                  const statusColorClass = getInventoryStatusColorClass(
                    item.current_qty
                  );

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-sky-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">
                        {item.component?.num || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.warehouse?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-sky-900">
                        {item.current_qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColorClass}`}
                        >
                          {getStatusIcon(statusText)}
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-6 border-t border-sky-200/50 flex justify-end">
        <button className="text-sky-600 font-medium hover:text-sky-700 hover:underline transition-colors duration-200">
          View full inventory
        </button>
      </div>
    </div>
  );
};
