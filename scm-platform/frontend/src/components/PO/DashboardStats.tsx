"use client";

import React from "react";
// Using lucide-react for icons, a common choice with Tailwind
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle } from "lucide-react";
import { PurchaseOrder } from "./types"; // Assuming this type is correctly defined

// Import your existing Card component from components/ui/card
import { Card } from "@/components/ui/card";

interface DashboardStatsProps {
  purchaseOrders: PurchaseOrder[];
}

export default function DashboardStats({
  purchaseOrders,
}: DashboardStatsProps) {
  const totalPOs = purchaseOrders.length;
  const totalValue = purchaseOrders.reduce(
    (sum, po) => sum + po.totalAmount,
    0
  );
  const unpaidValue = purchaseOrders
    .filter((po) => po.paymentStatus !== "Fully Paid")
    .reduce((sum, po) => sum + po.totalAmount, 0);
  const pendingApproval = purchaseOrders.filter(
    (po) => po.status === "Submitted" || po.status === "Approved"
  ).length;
  // This overduePOs calculation was not used in the original Chakra UI render,
  // but it's kept here for completeness if you decide to add an overdue stat later.
  const overduePOs = purchaseOrders.filter(
    (po) =>
      new Date(po.dateDue) < new Date() &&
      po.status !== "Delivered" &&
      po.status !== "Paid"
  ).length;

  // Helper component for stat arrows
  const StatArrowComponent = ({ type }: { type: "increase" | "decrease" }) => {
    if (type === "increase") {
      return <ArrowUp className="inline h-4 w-4 text-green-500" />;
    }
    return <ArrowDown className="inline h-4 w-4 text-red-500" />;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Total POs Card */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-200/50">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Total POs</h3>
        <p className="text-3xl font-bold text-blue-700">{totalPOs}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <StatArrowComponent type="increase" />
          <span className="ml-1">12% from last month</span>
        </div>
      </Card>

      {/* Total Value Card */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-200/50">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Value</h3>
        <p className="text-3xl font-bold text-blue-700">
          ${totalValue.toLocaleString()}
        </p>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <StatArrowComponent type="increase" />
          <span className="ml-1">8% from last month</span>
        </div>
      </Card>

      {/* Pending Approval Card */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-200/50">
        <h3 className="text-sm font-medium text-gray-600 mb-1">
          Pending Approval
        </h3>
        <p className="text-3xl font-bold text-blue-700">{pendingApproval}</p>
        <div className="flex items-center text-sm mt-2">
          {pendingApproval > 0 ? (
            <div className="flex items-center text-orange-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>Action needed</span>
            </div>
          ) : (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>All clear</span>
            </div>
          )}
        </div>
      </Card>

      {/* Unpaid Amount Card */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-200/50">
        <h3 className="text-sm font-medium text-gray-600 mb-1">
          Unpaid Amount
        </h3>
        <p
          className={`text-3xl font-bold ${
            unpaidValue > 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          ${unpaidValue.toLocaleString()}
        </p>
        <div className="flex items-center text-sm mt-2">
          {unpaidValue > 0 ? (
            <div className="flex items-center text-red-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>Payment pending</span>
            </div>
          ) : (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>All paid</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
