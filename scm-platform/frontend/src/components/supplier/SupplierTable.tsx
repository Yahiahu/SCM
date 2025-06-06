import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  FiMail,
  FiPhone,
  FiGlobe,
  FiStar,
  FiCalendar,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
  FiDollarSign,
} from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Supplier } from "./types";

interface SupplierTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  isMobile: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onCreatePO: () => void;
}

export const SupplierTable = ({
  suppliers,
  isLoading,
  isMobile,
  onEdit,
  onDelete,
  onViewDetails,
  onCreatePO,
}: SupplierTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-10 mb-2 w-full rounded-md bg-sky-100"
          />
        ))}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
        No suppliers found. Try adjusting your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
      <table className="w-full table-auto text-sm text-left border-separate border-spacing-y-2">
        <thead className="bg-sky-50 text-gray-600">
          <tr>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Contact</th>
            {!isMobile && (
              <>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">On-Time</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Last Order</th>
              </>
            )}
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="bg-white border rounded-lg shadow-sm hover:bg-sky-50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-sky-100 rounded-full flex items-center justify-center font-bold text-sm">
                    {supplier.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {supplier.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {supplier.components_supplied} components
                    </div>
                  </div>
                  {supplier.preferred && (
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      Preferred
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    {supplier.contact_email}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-400" />
                    {supplier.phone}
                  </div>
                </div>
              </td>
              {!isMobile && (
                <>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-700">
                    <FiGlobe className="text-gray-400" />
                    {supplier.location}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700 font-medium flex items-center gap-1`}
                    >
                      <FiStar /> {supplier.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-sky-100 rounded-full">
                        <div
                          className="h-1.5 bg-green-500 rounded-full"
                          style={{
                            width: `${supplier.historical_ontime_rate * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {(supplier.historical_ontime_rate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      {supplier.last_order_date || "Never"}
                    </div>
                  </td>
                </>
              )}
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <FiMoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-md shadow-md border">
                    <DropdownMenuItem onClick={() => onEdit(supplier)}>
                      <FiEdit2 className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(supplier.id)}
                    >
                      <FiTrash2 className="mr-2" /> Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onViewDetails(supplier.id)}
                    >
                      <FiArrowRight className="mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onCreatePO}>
                      <FiDollarSign className="mr-2" /> Create PO
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
