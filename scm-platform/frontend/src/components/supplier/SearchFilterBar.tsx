import { FiSearch, FiFilter, FiDownload, FiPrinter } from "react-icons/fi";
import { SortOption } from "./types";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onExport: () => void;
  onPrint: () => void;
  onAddSupplier: () => void;
}

export const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onExport,
  onPrint,
  onAddSupplier,
}: SearchFilterBarProps) => {
  return (
    <div className="rounded-xl border border-sky-100 bg-white shadow-sm px-5 py-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Filter Select */}
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 min-w-[180px]"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="ontime">Sort by On-Time Rate</option>
            <option value="status">Sort by Status</option>
            <option value="last_order">Sort by Last Order</option>
          </select>
        </div>

        {/* Buttons */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-sky-50 transition"
        >
          <FiDownload />
          Export
        </button>

        <button
          onClick={onPrint}
          className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-sky-50 transition"
        >
          <FiPrinter />
          Print
        </button>
      </div>
    </div>
  );
};
