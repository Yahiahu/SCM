import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { WarehouseInventory } from "./types";

interface ReorderAlertsProps {
  inventory: WarehouseInventory[];
}

export const ReorderAlerts = ({ inventory }: ReorderAlertsProps) => {
  // Filter for items with current_qty less than 10
  const lowStockItems = inventory.filter((item) => item.current_qty < 10);

  return (
    <div className="rounded-2xl shadow-xl shadow-red-500/10 border border-red-200/30 bg-white/50 backdrop-blur-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-red-200/50">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="w-6 h-6 text-red-700" />
          <h2 className="text-xl font-bold text-gray-800">Reorder Alerts</h2>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {lowStockItems.length > 0 ? (
          <div className="overflow-x-auto">
            {" "}
            {/* Added for horizontal scrolling on small screens */}
            <table className="min-w-full divide-y divide-sky-100/50">
              <thead className="bg-sky-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Component
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/70 divide-y divide-sky-100/50">
                {lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-sky-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">
                      {item.component?.num || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                        item.current_qty === 0
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {item.current_qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.warehouse?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-semibold rounded-full shadow-md shadow-orange-300/30 hover:from-orange-500 hover:to-red-500 transition-all duration-200">
                        Create PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center text-emerald-600 text-center py-6 px-4">
            <FiCheckCircle className="w-5 h-5 mr-2" />
            <p className="text-base font-medium">
              No reorder alerts at this time
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
