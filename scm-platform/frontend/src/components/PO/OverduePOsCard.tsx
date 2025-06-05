"use client";

import React from "react";
// Using lucide-react for icons
import { AlertTriangle, CheckCircle } from "lucide-react";
import { PurchaseOrder } from "./types"; // Assuming this type is correctly defined

// Import your existing Card and Button components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OverduePOsCardProps {
  purchaseOrders: PurchaseOrder[];
}

export default function OverduePOsCard({
  purchaseOrders,
}: OverduePOsCardProps) {
  const overduePOs = purchaseOrders.filter(
    (po) =>
      new Date(po.dateDue) < new Date() &&
      po.status !== "Delivered" &&
      po.status !== "Paid" &&
      po.status !== "Cancelled" // Added Cancelled to filter out irrelevant overdue POs
  );

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-blue-200/50 p-0 overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-2 bg-blue-50/80 p-4 border-b border-blue-100">
        <AlertTriangle className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-blue-800">
          Overdue Purchase Orders
        </h2>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {overduePOs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    PO Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vendor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Days Overdue
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overduePOs.map((po) => (
                  <tr key={po.id} className="hover:bg-blue-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {po.poNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {po.vendor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(po.dateDue).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        size="sm"
                      >
                        Follow Up
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 text-green-600">
            <CheckCircle className="h-8 w-8 mb-3" />
            <p className="text-lg">No overdue purchase orders. Great job!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
