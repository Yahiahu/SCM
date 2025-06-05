import {
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiArrowRight,
  FiPackage,
  FiActivity,
} from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Component } from "./types";
import { getStatusIcon, getStatusColor } from "./utils";
import { Skeleton } from "@radix-ui/themes";

interface ComponentsTableProps {
  components: Component[];
  isLoading: boolean;
  onEdit: (component: Component) => void;
  onDelete: (id: string) => void;
}

export const ComponentsTable = ({
  components,
  isLoading,
  onEdit,
  onDelete,
}: ComponentsTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gradient-to-r from-sky-100/50 via-blue-50/30 to-sky-100/50 rounded-xl border border-sky-200/30"></div>
          </div>
        ))}
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/10">
            <FiPackage className="w-10 h-10 text-sky-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-sky-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">0</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-sky-900 mb-2">
          No Components Found
        </h3>
        <p className="text-sky-600 text-center max-w-md">
          Try adjusting your search criteria or add new components to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl shadow-sky-500/10 border border-sky-200/30 bg-white/50 backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 border-b border-sky-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/25">
              <FiActivity className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
              Components Overview
            </h2>
          </div>
          <div className="text-sm text-sky-600 bg-sky-100/50 px-3 py-1 rounded-full border border-sky-200/50">
            {components.length} {components.length === 1 ? "item" : "items"}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-sky-50/80 via-white/50 to-blue-50/80 border-b border-sky-200/30">
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Part Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100/50">
            {components.map((component, index) => (
              <tr
                key={component.id}
                className={`group hover:bg-gradient-to-r hover:from-sky-50/50 hover:via-blue-50/30 hover:to-sky-50/50 transition-all duration-300 ${
                  index % 2 === 0 ? "bg-white/30" : "bg-sky-50/20"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center border border-sky-200/50 group-hover:shadow-md group-hover:shadow-sky-500/10 transition-all duration-300">
                      <span className="text-xs font-bold text-sky-600">
                        {component.num.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-sky-900 group-hover:text-sky-700 transition-colors duration-300">
                      {component.num}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-sky-800 truncate">
                      {component.description}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100/60 text-sky-700 border border-sky-200/50">
                    {component.type || "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-sky-900 min-w-[2ch]">
                      {component.currentQty}
                    </span>
                    <div className="relative w-20 h-2 bg-sky-100 rounded-full overflow-hidden border border-sky-200/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (component.currentQty / 100) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent"></div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 group-hover:shadow-sm ${
                      component.status === "In Stock"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                        : component.status === "Low Stock"
                        ? "bg-amber-50 text-amber-700 border-amber-200/50"
                        : component.status === "Out of Stock"
                        ? "bg-red-50 text-red-700 border-red-200/50"
                        : "bg-sky-50 text-sky-700 border-sky-200/50"
                    }`}
                  >
                    {getStatusIcon(component.status || "")}
                    {component.status}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-sky-700 font-medium">
                    {component.supplier || "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-sky-600">
                    {component.lastUpdated || "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative p-2 rounded-xl hover:bg-sky-100/50 border border-transparent hover:border-sky-200/50 transition-all duration-300 group/btn hover:shadow-md hover:shadow-sky-500/10">
                        <FiMoreVertical className="w-4 h-4 text-sky-600 group-hover/btn:text-sky-700 transition-colors duration-300" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-sky-200/50 rounded-2xl shadow-2xl shadow-sky-500/20 p-2 w-48 animate-in slide-in-from-top-2 duration-200">
                      <DropdownMenuItem
                        onSelect={() => onEdit(component)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-sky-700 hover:bg-sky-50/80 rounded-xl transition-all duration-200 cursor-pointer group/item"
                      >
                        <div className="w-8 h-8 bg-sky-100/50 rounded-lg flex items-center justify-center group-hover/item:bg-sky-200/50 transition-all duration-200">
                          <FiEdit2 className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Edit Component</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onSelect={() => onDelete(component.id)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 cursor-pointer group/item"
                      >
                        <div className="w-8 h-8 bg-red-100/50 rounded-lg flex items-center justify-center group-hover/item:bg-red-200/50 transition-all duration-200">
                          <FiTrash2 className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Delete</span>
                      </DropdownMenuItem>

                      <div className="h-px bg-sky-200/50 my-2 mx-2"></div>

                      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-sm text-sky-700 hover:bg-sky-50/80 rounded-xl transition-all duration-200 cursor-pointer group/item">
                        <div className="w-8 h-8 bg-sky-100/50 rounded-lg flex items-center justify-center group-hover/item:bg-sky-200/50 transition-all duration-200">
                          <FiArrowRight className="w-4 h-4" />
                        </div>
                        <span className="font-medium">View Details</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-1 bg-gradient-to-r from-sky-400/20 via-blue-400/30 to-sky-400/20"></div>
    </div>
  );
};
