"use client";

import React from "react";
// Using Lucide React for icons
import { Clock } from "lucide-react";

// Import your existing Card component
import { Card } from "@/components/ui/card";

export default function RecentActivityCard() {
  return (
    <Card className="p-0 overflow-hidden bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-md rounded-lg">
      {/* Card Header */}
      <div className="bg-blue-50/80 p-4 border-b border-blue-100 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-blue-800">Recent Activity</h2>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          {" "}
          {/* Simulating VStack with flexbox and gap */}
          {/* Today's Activity */}
          <div>
            <p className="font-bold text-gray-800 mb-1">Today</p>
            <ul className="list-none p-0 m-0 text-sm text-gray-700 space-y-1">
              <li>
                <span className="text-gray-500">•</span> PO-2024-006 created by
                John Doe
              </li>
              <li>
                <span className="text-gray-500">•</span> PO-2024-003 marked as
                Ordered
              </li>
            </ul>
          </div>
          {/* Yesterday's Activity */}
          <div>
            <p className="font-bold text-gray-800 mb-1">Yesterday</p>
            <ul className="list-none p-0 m-0 text-sm text-gray-700 space-y-1">
              <li>
                <span className="text-gray-500">•</span> PO-2024-002 partially
                paid ($300 of $600)
              </li>
              <li>
                <span className="text-gray-500">•</span> PO-2024-004 approved by
                Finance
              </li>
            </ul>
          </div>
          {/* This Week's Activity */}
          <div>
            <p className="font-bold text-gray-800 mb-1">This Week</p>
            <ul className="list-none p-0 m-0 text-sm text-gray-700 space-y-1">
              <li>
                <span className="text-gray-500">•</span> 3 new POs created
              </li>
              <li>
                <span className="text-gray-500">•</span> 2 deliveries received
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
