import { ArrowUpIcon, CheckCircleIcon, ClockIcon } from "lucide-react";

interface StatsCardsProps {
  totalItems: number;
  utilizationPercentage: number;
  processingOutgoing: number;
}

export const StatsCards = ({
  totalItems,
  utilizationPercentage,
  processingOutgoing,
}: StatsCardsProps) => {
  const getUtilizationColor = () => {
    if (utilizationPercentage > 90) return "bg-red-500";
    if (utilizationPercentage > 75) return "bg-orange-400";
    return "bg-green-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Items */}
      <div className="rounded-xl bg-white shadow p-4">
        <div className="text-sm text-gray-500">Total Items</div>
        <div className="text-2xl font-semibold text-gray-900">{totalItems}</div>
        <div className="flex items-center text-sm text-green-600 mt-1">
          <ArrowUpIcon className="w-4 h-4 mr-1" />
          8% from last month
        </div>
      </div>

      {/* Inventory Value */}
      <div className="rounded-xl bg-white shadow p-4">
        <div className="text-sm text-gray-500">Inventory Value</div>
        <div className="text-2xl font-semibold text-gray-900">$0</div>
        <div className="flex items-center text-sm text-green-600 mt-1">
          <ArrowUpIcon className="w-4 h-4 mr-1" />
          12% from last month
        </div>
      </div>

      {/* Warehouse Utilization */}
      <div className="rounded-xl bg-white shadow p-4">
        <div className="text-sm text-gray-500">Warehouse Utilization</div>
        <div className="text-2xl font-semibold text-gray-900">
          {utilizationPercentage}%
        </div>
        <div className="w-full h-2 bg-gray-200 rounded mt-2">
          <div
            className={`h-full ${getUtilizationColor()} rounded`}
            style={{ width: `${utilizationPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Pending Shipments */}
      <div className="rounded-xl bg-white shadow p-4">
        <div className="text-sm text-gray-500">Pending Shipments</div>
        <div
          className={`text-2xl font-semibold mt-1 ${
            processingOutgoing > 0 ? "text-orange-500" : "text-green-600"
          }`}
        >
          {processingOutgoing}
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          {processingOutgoing > 0 ? (
            <>
              <ClockIcon className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500">Needs processing</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-green-600">All shipments processed</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
