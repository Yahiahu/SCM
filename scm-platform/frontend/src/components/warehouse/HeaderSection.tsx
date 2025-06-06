import { FiPlus, FiRefreshCw } from "react-icons/fi";

interface HeaderSectionProps {
  onOpen: () => void;
  refreshData: () => void;
  isLoading: boolean;
}

export const HeaderSection = ({
  onOpen,
  refreshData,
  isLoading,
}: HeaderSectionProps) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-semibold text-gray-800">
      Warehouse Management
    </h1>
    <div className="flex gap-3">
      <button
        onClick={refreshData}
        disabled={isLoading}
        className={`flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50`}
      >
        <FiRefreshCw className="h-4 w-4" />
        {isLoading ? "Refreshing..." : "Refresh"}
      </button>
      <button
        onClick={onOpen}
        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
      >
        <FiPlus className="h-4 w-4" />
        Add Item
      </button>
    </div>
  </div>
);
