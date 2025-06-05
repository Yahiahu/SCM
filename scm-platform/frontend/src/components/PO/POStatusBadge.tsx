"use client";

import React from "react";
import {
  CircleDotDashed,
  CircleCheck,
  Truck,
  PackageCheck,
  Ban,
  Hourglass,
  BadgeInfo,
} from "lucide-react"; // Importing various icons

interface POStatusBadgeProps {
  status: string;
}

// Utility function to determine the Tailwind classes based on status
const getStatusClasses = (status: string): string => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-700 ring-gray-600/20";
    case "Submitted":
      return "bg-blue-100 text-blue-700 ring-blue-600/20";
    case "Approved":
      return "bg-green-100 text-green-700 ring-green-600/20";
    case "Ordered":
      return "bg-indigo-100 text-indigo-700 ring-indigo-600/20";
    case "Received":
      return "bg-purple-100 text-purple-700 ring-purple-600/20";
    case "Cancelled":
      return "bg-red-100 text-red-700 ring-red-600/20";
    // Add other cases for your specific statuses
    default:
      return "bg-gray-100 text-gray-700 ring-gray-600/20";
  }
};

// Utility function to get the appropriate Lucide icon
const getStatusIcon = (status: string) => {
  const iconClasses = "h-3.5 w-3.5"; // Consistent icon size

  switch (status) {
    case "Draft":
      return <CircleDotDashed className={iconClasses} />;
    case "Submitted":
      return <Hourglass className={iconClasses} />;
    case "Approved":
      return <CircleCheck className={iconClasses} />;
    case "Ordered":
      return <Truck className={iconClasses} />; // Truck icon for ordered/in transit
    case "Received":
      return <PackageCheck className={iconClasses} />; // Package delivered
    case "Cancelled":
      return <Ban className={iconClasses} />;
    default:
      return <BadgeInfo className={iconClasses} />; // Generic info icon
  }
};

export default function POStatusBadge({ status }: POStatusBadgeProps) {
  const classes = getStatusClasses(status);
  const IconComponent = getStatusIcon(status);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {IconComponent}
      {status}
    </span>
  );
}
