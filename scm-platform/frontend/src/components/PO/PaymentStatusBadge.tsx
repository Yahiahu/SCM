"use client";

import React from "react";

interface PaymentStatusBadgeProps {
  status: string;
}

// Utility function to determine the Tailwind classes based on status
const getPaymentStatusClasses = (status: string): string => {
  switch (status) {
    case "Fully Paid":
      return "bg-green-100 text-green-700 ring-green-600/20";
    case "Partially Paid":
      return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
    case "Unpaid":
      return "bg-red-100 text-red-700 ring-red-600/20";
    // Add other cases as needed for your specific payment statuses
    default:
      return "bg-gray-100 text-gray-700 ring-gray-600/20";
  }
};

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  const classes = getPaymentStatusClasses(status);

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {status}
    </span>
  );
}
