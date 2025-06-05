"use client";

import React from "react";
// Using lucide-react for icons, a common choice with Tailwind
import { Search, SlidersHorizontal, Download, Printer } from "lucide-react";

// Import your existing UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface POFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function POFilterBar({
  searchTerm,
  onSearchChange,
}: POFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
      {/* Search Input Group */}
      <div className="relative w-full max-w-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search POs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-blue-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <Button
        variant="outline"
        className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-1.5"
        size="sm"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Advanced
      </Button>
      <Button
        variant="outline"
        className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-1.5"
        size="sm"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      <Button
        variant="outline"
        className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-1.5"
        size="sm"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
}
