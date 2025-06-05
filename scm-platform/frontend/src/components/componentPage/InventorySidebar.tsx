import { FiPlus, FiDownload, FiPrinter, FiArrowRight } from "react-icons/fi";
import { Component } from "./types";

interface InventorySidebarProps {
  components: Component[];
  onAddComponent: () => void;
  onImport: () => void;
  onPrintLabels: () => void;
  onViewSuppliers: () => void;
  onGenerateReport: () => void;
}

export const InventorySidebar = ({
  components,
  onAddComponent,
  onImport,
  onPrintLabels,
  onViewSuppliers,
  onGenerateReport,
}: InventorySidebarProps) => {
  const inStockCount = components.filter((c) => c.status === "In Stock").length;
  const lowStockCount = components.filter(
    (c) => c.status === "Low Stock"
  ).length;
  const outOfStockCount = components.filter(
    (c) => c.status === "Out of Stock"
  ).length;

  return (
    <div className="space-y-6">
      {/* Inventory Summary Card */}
      <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm p-4">
        <div className="border-b border-sky-200/50 pb-4 mb-4">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
            Inventory Summary
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-sky-600">Total Components</p>
            <span className="text-2xl font-bold text-sky-900">
              {components.length}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-sky-600">In Stock</p>
            <span className="text-2xl font-bold text-emerald-600">
              {inStockCount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-sky-600">Low Stock</p>
            <span className="text-2xl font-bold text-amber-600">
              {lowStockCount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-sky-600">Out of Stock</p>
            <span className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </span>
          </div>
        </div>
        <div className="pt-6 mt-6 border-t border-sky-200/50">
          <button
            onClick={onGenerateReport}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm p-6">
        <div className="border-b border-sky-200/50 pb-4 mb-4">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
            Quick Actions
          </h2>
        </div>
        <div className="space-y-3">
          <button
            onClick={onAddComponent}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-sky-700 border border-sky-200/50 rounded-xl hover:bg-sky-50/80 hover:border-sky-300/50 transition-all duration-200 group/btn hover:shadow-md hover:shadow-sky-500/10"
          >
            <FiPlus className="w-4 h-4 text-sky-600 group-hover/btn:text-sky-700 transition-colors duration-300" />
            Add Component
          </button>
          <button
            onClick={onImport}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-sky-700 border border-sky-200/50 rounded-xl hover:bg-sky-50/80 hover:border-sky-300/50 transition-all duration-200 group/btn hover:shadow-md hover:shadow-sky-500/10"
          >
            <FiDownload className="w-4 h-4 text-sky-600 group-hover/btn:text-sky-700 transition-colors duration-300" />
            Import Components
          </button>
          <button
            onClick={onPrintLabels}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-sky-700 border border-sky-200/50 rounded-xl hover:bg-sky-50/80 hover:border-sky-300/50 transition-all duration-200 group/btn hover:shadow-md hover:shadow-sky-500/10"
          >
            <FiPrinter className="w-4 h-4 text-sky-600 group-hover/btn:text-sky-700 transition-colors duration-300" />
            Print Labels
          </button>
          <button
            onClick={onViewSuppliers}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-sky-700 border border-sky-200/50 rounded-xl hover:bg-sky-50/80 hover:border-sky-300/50 transition-all duration-200 group/btn hover:shadow-md hover:shadow-sky-500/10"
          >
            <FiArrowRight className="w-4 h-4 text-sky-600 group-hover/btn:text-sky-700 transition-colors duration-300" />
            View Suppliers
          </button>
        </div>
      </div>
    </div>
  );
};
