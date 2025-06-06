import { FiPlus, FiDollarSign, FiDownload, FiTruck } from "react-icons/fi";

interface QuickActionsCardProps {
  onAddSupplier: () => void;
  onCreatePO: () => void;
  onImportSuppliers: () => void;
  onViewShipping: () => void;
}

export const QuickActionsCard = ({
  onAddSupplier,
  onCreatePO,
  onImportSuppliers,
  onViewShipping,
}: QuickActionsCardProps) => {
  return (
    <div className="rounded-xl border border-sky-100 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-sky-100 bg-sky-50">
        <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
      </div>

      <div className="p-5 space-y-3">
        <button
          onClick={onAddSupplier}
          className="w-full flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-sky-50 transition"
        >
          <FiPlus className="text-sky-600" />
          Add Supplier
        </button>

        <button
          onClick={onCreatePO}
          className="w-full flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-sky-50 transition"
        >
          <FiDollarSign className="text-sky-600" />
          Create Purchase Order
        </button>

        <button
          onClick={onImportSuppliers}
          className="w-full flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-sky-50 transition"
        >
          <FiDownload className="text-sky-600" />
          Import Supplier List
        </button>

        <button
          onClick={onViewShipping}
          className="w-full flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-sky-50 transition"
        >
          <FiTruck className="text-sky-600" />
          View Shipping Updates
        </button>
      </div>
    </div>
  );
};
