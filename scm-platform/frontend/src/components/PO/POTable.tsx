"use client";

import React from "react";
// Import Lucide React icons
import {
  MoreVertical,
  Edit,
  Check,
  ShoppingCart,
  Truck,
  DollarSign,
  Trash2,
  ListFilter, // A good icon for 'All POs' or general table actions
  CircleDashed, // For Draft
  Hourglass, // For Pending Approval
  Package, // For Ordered
  PackageCheck, // For Delivered
  Wallet, // For Unpaid
  Info, // Fallback icon for generic info
} from "lucide-react";

// Import Radix UI components
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"; // For the actions menu
import * as Tabs from "@radix-ui/react-tabs"; // For the tabs

// Import your existing UI components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import POStatusBadge from "./POStatusBadge"; // Your converted badge
import PaymentStatusBadge from "./PaymentStatusBadge"; // Your converted badge
import POFilterBar from "./POFilterBar"; // Your converted filter bar

import { PurchaseOrder } from "./types"; // Assuming this type is correctly defined

interface POTableProps {
  purchaseOrders: PurchaseOrder[];
  searchTerm: string;
  activeTab: number;
  onTabChange: (index: number) => void;
  onSearchChange: (term: string) => void;
  onDeletePO?: (id: number) => void;
  onUpdatePOStatus?: (id: number, status: PurchaseOrder["status"]) => void;
}

// Helper to determine the tab icon
const getTabIcon = (tabIndex: number) => {
  const iconClasses = "h-4 w-4 mr-1";
  switch (tabIndex) {
    case 0:
      return <ListFilter className={iconClasses} />; // All POs
    case 1:
      return <CircleDashed className={iconClasses} />; // Drafts
    case 2:
      return <Hourglass className={iconClasses} />; // Pending Approval
    case 3:
      return <Package className={iconClasses} />; // Ordered
    case 4:
      return <PackageCheck className={iconClasses} />; // Delivered
    case 5:
      return <Wallet className={iconClasses} />; // Unpaid
    default:
      return <Info className={iconClasses} />;
  }
};

export default function POTable({
  purchaseOrders,
  searchTerm,
  activeTab,
  onTabChange,
  onSearchChange,
  onDeletePO,
  onUpdatePOStatus,
}: POTableProps) {
  const filteredPOs = purchaseOrders
    .filter((po) => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;
      switch (activeTab) {
        case 0: // All POs
          matchesTab = true;
          break;
        case 1: // Drafts
          matchesTab = po.status === "Draft";
          break;
        case 2: // Pending Approval
          matchesTab = po.status === "Submitted" || po.status === "Approved";
          break;
        case 3: // Ordered
          matchesTab = po.status === "Ordered";
          break;
        case 4: // Delivered
          matchesTab = po.status === "Delivered";
          break;
        case 5: // Unpaid
          matchesTab = po.paymentStatus !== "Fully Paid";
          break;
      }

      return matchesSearch && matchesTab;
    })
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

  return (
    <Card className="p-0 overflow-hidden bg-white/90 backdrop-blur-sm border border-blue-200/50">
      {/* Card Header */}
      <div className="bg-blue-50/80 p-4 border-b border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-blue-700" />
          <h2 className="text-xl font-semibold text-blue-800">
            Purchase Orders
          </h2>
        </div>

        <POFilterBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>

      {/* Card Body - Tabs and Table */}
      <div className="p-0">
        <Tabs.Root
          className="flex flex-col"
          value={activeTab.toString()} // Radix Tabs expect string value
          onValueChange={(value) => onTabChange(parseInt(value))}
        >
          <Tabs.List
            className="flex flex-wrap border-b border-gray-200 px-4 pt-2"
            aria-label="Filter purchase orders"
          >
            {[
              "All POs",
              "Drafts",
              "Pending Approval",
              "Ordered",
              "Delivered",
              "Unpaid",
            ].map((tabName, index) => (
              <Tabs.Trigger
                key={index}
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-700 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-semibold focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 -mb-px"
                value={index.toString()}
              >
                {getTabIcon(index)}
                {tabName}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab Panels */}
          {[0, 1, 2, 3, 4, 5].map((tabIndex) => (
            <Tabs.Content key={tabIndex} value={tabIndex.toString()}>
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
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Due Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Payment
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Assigned
                      </th>
                      <th
                        scope="col"
                        className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPOs.length > 0 ? (
                      filteredPOs.map((po) => (
                        <tr key={po.id} className="hover:bg-blue-50/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <a
                              href={`/purchase-orders/${po.id}`} // Using standard <a> for navigation
                              className="text-blue-600 hover:underline"
                            >
                              {po.poNumber}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {po.vendor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {po.vendor.contact}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* Replicating AvatarGroup functionality with simple divs/spans */}
                            <div className="flex -space-x-2 overflow-hidden mb-1">
                              {po.items.slice(0, 3).map((item, idx) => (
                                <div
                                  key={item.id}
                                  className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-medium ring-2 ring-white"
                                  style={{ zIndex: 3 - idx }} // Stagger z-index for overlapping effect
                                  title={item.component.name}
                                >
                                  {item.component.name.charAt(0).toUpperCase()}
                                </div>
                              ))}
                              {po.items.length > 3 && (
                                <div
                                  className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-medium ring-2 ring-white"
                                  title={`+${po.items.length - 3} more`}
                                >
                                  +{po.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-700">
                              {po.items.length} item
                              {po.items.length !== 1 ? "s" : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                            ${po.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {po.dateDue}
                            </div>
                            {new Date(po.dateDue) < new Date() &&
                              po.status !== "Delivered" &&
                              po.status !== "Paid" &&
                              po.status !== "Cancelled" && ( // Added Cancelled to filter
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 mt-1">
                                  Overdue
                                </span>
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <POStatusBadge status={po.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PaymentStatusBadge status={po.paymentStatus} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {po.assignedTo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Radix UI Dropdown Menu for Actions */}
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenu.Trigger>

                              <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                  className="z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-100 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                  align="end"
                                  sideOffset={5}
                                >
                                  <DropdownMenu.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onClick={() => console.log("Edit PO")} // Replace with actual edit logic
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenu.Item>

                                  {po.status === "Draft" && (
                                    <DropdownMenu.Item
                                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                      onClick={() =>
                                        onUpdatePOStatus?.(po.id, "Submitted")
                                      }
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Submit for Approval
                                    </DropdownMenu.Item>
                                  )}
                                  {(po.status === "Submitted" ||
                                    po.status === "Draft") && ( // Allow approval from Draft for flexibility
                                    <DropdownMenu.Item
                                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                      onClick={() =>
                                        onUpdatePOStatus?.(po.id, "Approved")
                                      }
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenu.Item>
                                  )}
                                  {po.status === "Approved" && (
                                    <DropdownMenu.Item
                                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                      onClick={() =>
                                        onUpdatePOStatus?.(po.id, "Ordered")
                                      }
                                    >
                                      <ShoppingCart className="mr-2 h-4 w-4" />
                                      Mark as Ordered
                                    </DropdownMenu.Item>
                                  )}
                                  {po.status === "Ordered" && (
                                    <DropdownMenu.Item
                                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                      onClick={
                                        () =>
                                          onUpdatePOStatus?.(po.id, "Delivered") // Changed from "Delivered" to "Received"
                                      }
                                    >
                                      <Truck className="mr-2 h-4 w-4" />
                                      Mark as Received
                                    </DropdownMenu.Item>
                                  )}
                                  {po.status == "Delivered" && ( // Changed from "Delivered"
                                    <DropdownMenu.Item
                                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                      onClick={
                                        () => onUpdatePOStatus?.(po.id, "Paid") // Assuming "Paid" means "Fully Paid"
                                      }
                                    >
                                      <DollarSign className="mr-2 h-4 w-4" />
                                      Mark as Paid
                                    </DropdownMenu.Item>
                                  )}
                                  <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                                  <DropdownMenu.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-50 focus:text-red-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onClick={() => onDeletePO?.(po.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-8 text-center text-gray-500 text-base"
                        >
                          No purchase orders found for this view.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/80 text-sm text-gray-600">
        Showing {filteredPOs.length} of {purchaseOrders.length} purchase orders
      </div>
    </Card>
  );
}
