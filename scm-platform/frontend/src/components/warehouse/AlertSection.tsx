import { FiAlertTriangle, FiClock } from "react-icons/fi";

interface AlertsSectionProps {
  outOfStockItems: number;
  delayedIncoming: number;
}

export const AlertsSection = ({
  outOfStockItems,
  delayedIncoming,
}: AlertsSectionProps) => {
  if (outOfStockItems === 0 && delayedIncoming === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {outOfStockItems > 0 && (
        <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4">
          <FiAlertTriangle className="text-red-500 mt-1" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-red-800">
              {outOfStockItems} items out of stock
            </h3>
            <p className="text-sm text-red-700">
              Urgent action needed to replenish inventory
            </p>
          </div>
        </div>
      )}

      {delayedIncoming > 0 && (
        <div className="flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <FiClock className="text-yellow-500 mt-1" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800">
              {delayedIncoming} delayed shipments
            </h3>
            <p className="text-sm text-yellow-700">
              Check incoming shipments for updates
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
