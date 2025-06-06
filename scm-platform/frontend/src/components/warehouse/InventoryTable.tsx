import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiBox,
  FiExternalLink,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import { InventoryItem } from "./types";

interface InventoryTableProps {
  isLoading: boolean;
  inventory: InventoryItem[];
  filteredInventory: InventoryItem[];
  activeTab: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setActiveTab: (index: number) => void;
  updateItemQuantity: (id: number, newQuantity: number) => void;
  deleteItem: (id: number) => void;
  handleViewLocation: (locationId: number) => void;
  router: any;
}

export const InventoryTable = ({
  isLoading,
  inventory,
  filteredInventory,
  activeTab,
  searchTerm,
  setSearchTerm,
  setActiveTab,
  updateItemQuantity,
  deleteItem,
  handleViewLocation,
  router,
}: InventoryTableProps) => {
  const getInventoryStatus = (item: InventoryItem) => {
    if (item.currentQty <= 0) return "Out of Stock";
    if (item.currentQty < 10) return "Low Stock";
    return "In Stock";
  };

  const getStatusClasses = (status: string) => {
    if (status === "In Stock")
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (status === "Low Stock")
      return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "In Stock") return <FiCheckCircle className="w-3 h-3" />;
    if (status === "Low Stock") return <FiAlertTriangle className="w-3 h-3" />;
    return <FiTrendingUp className="w-3 h-3" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 border-b border-sky-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-xl">
              <FiBox className="text-sky-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Inventory Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage your inventory across all locations
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-sky-400 w-5 h-5" />
            </div>
            <input
              type="text"
              className="block w-full lg:w-80 pl-10 pr-4 py-3 border border-sky-200 rounded-xl 
                         focus:ring-2 focus:ring-sky-500 focus:border-transparent 
                         bg-white/80 backdrop-blur-sm placeholder-gray-400 text-sm
                         transition-all duration-200"
              placeholder="Search components, part numbers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-sky-50/30">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-100"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-sky-500 absolute top-0 left-0"></div>
          </div>
          <p className="text-sky-600 mt-4 font-medium">
            Loading inventory data...
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-100">
            <thead className="bg-sky-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-sky-900 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-sky-900 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-sky-900 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-sky-900 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-sky-900 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-sky-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-sky-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-50">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item, index) => {
                  const status = getInventoryStatus(item);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-sky-50/50 transition-colors duration-150 
                                ${
                                  index % 2 === 0 ? "bg-white" : "bg-sky-50/20"
                                }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.component.num}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {item.component.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {item.component.supplier.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">
                          {item.warehouse.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {item.currentQty.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                    text-xs font-semibold border ${getStatusClasses(
                                      status
                                    )}`}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewLocation(item.warehouseId)}
                            className="p-2 hover:bg-sky-100 rounded-lg transition-colors duration-150 
                                     text-sky-600 hover:text-sky-700 group"
                            title="View Location"
                          >
                            <FiMapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() =>
                              updateItemQuantity(item.id, item.currentQty + 1)
                            }
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-150 
                                     text-blue-600 hover:text-blue-700 group"
                            title="Edit Quantity"
                          >
                            <FiEdit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-150 
                                     text-red-500 hover:text-red-600 group"
                            title="Delete Item"
                          >
                            <FiTrash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FiBox className="w-12 h-12 mb-4 text-sky-300" />
                      <p className="text-lg font-medium text-gray-500 mb-2">
                        No inventory items found
                      </p>
                      <p className="text-sm text-gray-400">
                        Try adjusting your search criteria or add new inventory
                        items
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-t border-sky-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-sky-700">
            <span className="font-medium">
              Showing {filteredInventory.length.toLocaleString()} of{" "}
              {inventory.length.toLocaleString()} items
            </span>
            {searchTerm && (
              <span className="px-2 py-1 bg-sky-100 text-sky-800 rounded-md text-xs font-medium">
                Filtered
              </span>
            )}
          </div>
          <button
            onClick={() => router.push("/inventory/reports")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 
                     text-sky-700 hover:bg-sky-50 hover:border-sky-300 rounded-lg font-medium 
                     transition-all duration-200 group text-sm shadow-sm"
          >
            <span>View Detailed Reports</span>
            <FiExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
