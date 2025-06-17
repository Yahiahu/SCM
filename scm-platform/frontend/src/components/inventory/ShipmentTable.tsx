import { FiTruck } from "react-icons/fi";
import { ShippingInfo } from "./types";
// Assuming getStatusColor and getStatusIcon are now pure JS/TS functions
// that return color strings (e.g., "green", "orange") and JSX.Element for icons.
import { getStatusColor, getStatusIcon } from "./utils";
import { useRouter } from "next/navigation";

interface ShipmentsTableProps {
  shipments: ShippingInfo[];
  isLoading: boolean;
  // These props are now handled by the imported getStatusColor/Icon from utils
  // getStatusColor: (status: string) => "green" | "orange" | "red" | "gray";
  // getStatusIcon: (status: string) => JSX.Element | null;
}

export const ShipmentsTable = ({
  shipments,
  isLoading,
}: ShipmentsTableProps) => {
  const router = useRouter();

  return (
    <div className="rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-b border-sky-200/50">
        <div className="flex items-center gap-3">
          <FiTruck className="w-6 h-6 text-sky-700" />
          <h2 className="text-xl font-bold text-gray-800">Shipments</h2>
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
            {" "}
            {/* Added for horizontal scrolling on small screens */}
            <table className="min-w-full divide-y divide-sky-200/50">
              <thead className="bg-sky-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Component
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    ETA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/70 divide-y divide-sky-100/50">
                {shipments.slice(0, 5).map((shipment) => (
                  <tr
                    key={shipment.id}
                    onClick={() => router.push(`/Shipments/${shipment.id}`)}
                    className="cursor-pointer hover:bg-sky-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">
                      {shipment.component?.num || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          // Dynamically set background and text color based on status
                          getStatusColor(shipment.status) === "green"
                            ? "bg-emerald-100 text-emerald-800"
                            : getStatusColor(shipment.status) === "orange"
                            ? "bg-amber-100 text-amber-800"
                            : getStatusColor(shipment.status) === "red"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusIcon(shipment.status)}
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.estimated_arrival}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-6 border-t border-sky-200/50 flex justify-end">
        <button
          onClick={() => router.push("/shipments")}
          className="text-sky-600 font-medium hover:text-sky-700 hover:underline transition-colors duration-200"
        >
          Track All Shipments
        </button>
      </div>
    </div>
  );
};
