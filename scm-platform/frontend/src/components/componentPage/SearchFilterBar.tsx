import { FiSearch, FiFilter, FiDownload, FiPrinter } from "react-icons/fi";
import { SortByOption } from "./types"; // Assuming SortByOption type is defined here

interface SearchFilterBarProps {
  searchTerm: string;
  sortBy: SortByOption;
  onSearchChange: (term: string) => void;
  onSortChange: (sortBy: SortByOption) => void;
  onExport: () => void;
  onPrint: () => void;
}

export const SearchFilterBar = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange,
  onExport,
  onPrint,
}: SearchFilterBarProps) => {
  return (
    <div className="mb-6 rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm p-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[300px] flex items-center gap-3 border border-sky-200/50 rounded-xl px-4 py-2 bg-white/70 focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-300 transition-all duration-200">
          <FiSearch className="w-5 h-5 text-sky-500" />
          <input
            type="text"
            placeholder="Search components..."
            className="flex-1 bg-transparent outline-none text-sky-800 placeholder-sky-400"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sort By Select */}
        <div className="relative flex items-center gap-3 border border-sky-200/50 rounded-xl px-4 py-2 bg-white/70 min-w-[180px] focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-30- transition-all duration-200">
          <FiFilter className="w-5 h-5 text-sky-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortByOption)}
            className="flex-1 bg-transparent outline-none appearance-none text-sky-800 pr-8 cursor-pointer"
          >
            <option value="name" className="text-sky-800">
              Sort by Part Number
            </option>
            <option value="type" className="text-sky-800">
              Sort by Type
            </option>
            <option value="quantity" className="text-sky-800">
              Sort by Quantity
            </option>
            <option value="status" className="text-sky-800">
              Sort by Status
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-sky-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-700 border border-sky-200/50 rounded-xl hover:bg-sky-50/80 hover:border-sky-300/50 transition-all duration-200 group/btn hover:shadow-md hover:shadow-sky-500/10"
        >
          <FiDownload className="w-4 h-4 text-sky-600 group-hover/btn:text-sky-700 transition-colors duration-300" />
          Export
        </button>

        {/* Print Button */}
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-700 border border-sky-200/50 rounded-xl hover:bg-sky-50/80 hover:border-sky-300/50 transition-all duration-200 group/btn hover:shadow-md hover:shadow-sky-500/10"
        >
          <FiPrinter className="w-4 h-4 text-sky-600 group-hover/btn:text-sky-700 transition-colors duration-300" />
          Print
        </button>
      </div>
    </div>
  );
};
