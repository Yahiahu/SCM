"use client";

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiTruck,
  FiShoppingCart,
  FiOctagon,
  FiAlertTriangle,
  FiActivity, // Make sure FiActivity is imported if used
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Import your components (assuming they are already Tailwind/Radix friendly)
import { AddItemModal } from "../components/inventory/AddItemModal";
import { LogisticsStats } from "../components/inventory/LogisticsStats";
import { PurchaseOrdersTable } from "../components/inventory/PurchaseOrderTable";
import { ShipmentsTable } from "../components/inventory/ShipmentTable";
import { WarehouseTable } from "../components/inventory/WarehouseTable";
import { RecentActivity } from "../components/inventory/RecentActivity";
import { ReorderAlerts } from "../components/inventory/ReorderAlerts";

// Interfaces (These remain the same as they are data types)
interface PurchaseOrder {
  id: number;
  status: "Draft" | "Ordered" | "Received";
  date_created: string;
  date_expected?: string;
  date_received?: string;
  supplier: {
    name: string;
  };
  createdBy: {
    username: string;
  };
  items: {
    component: {
      num: string;
      description: string;
    };
    ordered_qty: number;
    received_qty: number;
  }[];
}

interface ShippingInfo {
  id: number;
  status: "Processing" | "In Transit" | "Delivered" | "Delayed";
  estimated_arrival: string;
  carrier: string;
  tracking_number: string;
  origin: string;
  destination: string;
  component: {
    num: string;
    description: string;
  };
  qty: number;
  deliveryDate?: string; // Added for RecentActivity logic
  statusDate?: string; // Added for RecentActivity logic
}

interface WarehouseInventory {
  id: number;
  current_qty: number;
  incoming_qty: number;
  outgoing_qty: number;
  component: {
    num: string;
    description: string;
  };
  warehouse: {
    name: string;
    location: string;
  };
  lastUpdated?: string; // Added for RecentActivity logic
}

// Re-using the BlurredBackground component for consistent design
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {" "}
    {/* Added pointer-events-none */}
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

// Custom Toast Component (remains unchanged as it's already Tailwind friendly)
const Toast = ({
  message,
  type,
  show,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  show: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-24 right-6 z-50 p-4 rounded-xl shadow-2xl border backdrop-blur-xl animate-in slide-in-from-right-full duration-300 ${
        type === "success"
          ? "bg-emerald-50/95 border-emerald-200/50 text-emerald-800"
          : "bg-red-50/95 border-red-200/50 text-red-800"
      }`}
    >
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <FiCheckCircle className="w-5 h-5 text-emerald-600" />
        ) : (
          <FiAlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Helper functions (assuming these are already pure JS/TS)
// Note: If getStatusColor and getStatusIcon were in a separate utils file,
// ensure they are imported directly. I've included them here for completeness
// as they were part of your provided code for LogisticsPage.
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Received":
    case "Delivered":
    case "In Stock": // Added for WarehouseTable status
      return "emerald";
    case "Ordered":
    case "In Transit":
    case "Low Stock": // Added for WarehouseTable status
      return "amber";
    case "Draft":
    case "Delayed":
    case "Out of Stock": // Added for WarehouseTable status
      return "red";
    default:
      return "sky";
  }
};

export const getStatusIcon = (status: string) => {
  // Common icon props for consistency
  const iconProps = { className: "w-4 h-4" };

  switch (status) {
    case "Received":
    case "Delivered":
    case "In Stock":
      return <FiCheckCircle {...iconProps} />;
    case "Ordered":
    case "In Transit":
    case "Low Stock":
      return <FiAlertCircle {...iconProps} />;
    case "Draft":
    case "Delayed":
    case "Out of Stock":
      return <FiAlertTriangle {...iconProps} />; // Changed from FiClock to FiAlertTriangle for 'Delayed' and 'Out of Stock' based on common alert patterns
    default:
      return null;
  }
};

export default function LogisticsPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [shipments, setShipments] = useState<ShippingInfo[]>([]);
  const [inventory, setInventory] = useState<WarehouseInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [poResponse, shippingResponse, inventoryResponse] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchaseorder`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shippinginfo`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouseinventory`),
          ]);

        if (!poResponse.ok) throw new Error("Failed to load purchase orders");
        const poData: PurchaseOrder[] = await poResponse.json();

        if (!shippingResponse.ok) throw new Error("Failed to load shipments");
        const shippingData: ShippingInfo[] = await shippingResponse.json();

        if (!inventoryResponse.ok) throw new Error("Failed to load inventory");
        const inventoryData: WarehouseInventory[] =
          await inventoryResponse.json();

        setPurchaseOrders(poData);
        setShipments(shippingData);
        setInventory(inventoryData);
      } catch (error) {
        showToast("Failed to load logistics data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for adding new items
  const handleAddItem = async (formData: any) => {
    try {
      if (formData.type === "order") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase_order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplierId: parseInt(formData.supplierId),
            status: formData.status,
            items: [
              {
                componentId: parseInt(formData.componentId),
                ordered_qty: parseInt(formData.quantity),
                received_qty: 0,
              },
            ],
          }),
        });
        if (!response.ok) throw new Error("Failed to create purchase order");

        const newOrder = await response.json();
        setPurchaseOrders((prev) => [...prev, newOrder]);
      } else if (formData.type === "shipment") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipping_info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            poId: 1, // Assuming a default PO ID for new shipments
            componentId: parseInt(formData.componentId),
            qty: parseInt(formData.quantity),
            origin: formData.origin,
            destination: formData.destination,
            carrier: formData.carrier,
            tracking_number: formData.trackingNumber,
            status: "Processing",
            estimated_arrival: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // 7 days from now
          }),
        });
        if (!response.ok) throw new Error("Failed to create shipment");

        const newShipment = await response.json();
        setShipments((prev) => [...prev, newShipment]);
      }

      showToast("Item added successfully", "success");
      setIsModalOpen(false);
      // Re-fetch data after successful add to ensure all tables are updated
      const [poResponse, shippingResponse, inventoryResponse] =
        await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchaseorder`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shippinginfo`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouseinventory`),
        ]);
      setPurchaseOrders(await poResponse.json());
      setShipments(await shippingResponse.json());
      setInventory(await inventoryResponse.json());
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to add item",
        "error"
      );
    }
  };

  // Calculate inventory metrics (these are already handled in LogisticsStats now)
  const itemsNeedingReorder = inventory.filter(
    (item) => item.current_qty < 10
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      {/* Blurred Background from ComponentsPage */}
      <BlurredBackground />
      {/* Grid pattern overlay from ComponentsPage */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto py-2">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-700 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                    Inventory
                  </h1>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 group overflow-hidden shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                <FiPlus className="relative w-4 h-4 mr-2 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
                <span className="relative">Add Item</span>
              </button>
            </div>

            {/* Quick Overview Cards (These are similar to your LogisticsStats component,
                but I've kept them here as they were explicitly in the provided code) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: FiShoppingCart,
                  title: "Purchase Orders",
                  value: purchaseOrders.length,
                  change: "+12%",
                  color: "sky",
                },
                {
                  icon: FiTruck,
                  title: "Active Shipments",
                  value: shipments.length,
                  change: "+8%",
                  color: "blue",
                },
                {
                  icon: FiOctagon,
                  title: "Inventory Items",
                  value: inventory.length,
                  change: "+5%",
                  color: "cyan",
                },
                {
                  icon: FiAlertTriangle,
                  title: "Reorder Alerts",
                  value: itemsNeedingReorder,
                  change: "-3%",
                  color: "amber",
                },
              ].map((card, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-blue-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/60 backdrop-blur-xl border border-sky-200/50 rounded-2xl p-6 shadow-lg shadow-sky-500/5 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br from-${card.color}-100 to-${card.color}-200 rounded-xl flex items-center justify-center border border-${card.color}-200/50`}
                      >
                        <card.icon
                          className={`w-6 h-6 text-${card.color}-600`}
                        />
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {card.change}
                      </span>
                    </div>
                    <h3
                      className={`text-2xl font-bold text-${card.color}-900 mb-1`}
                    >
                      {card.value}
                    </h3>
                    <p className="text-sky-600 text-sm font-medium">
                      {card.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Component (Your custom component) */}
          <div className="mb-8">
            <LogisticsStats
              purchaseOrders={purchaseOrders}
              shipments={shipments}
              inventory={inventory}
            />
          </div>

          {/* Main Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <PurchaseOrdersTable
                purchaseOrders={purchaseOrders}
                isLoading={isLoading}
              />
            </div>

            <div className="lg:col-span-1">
              <ShipmentsTable shipments={shipments} isLoading={isLoading} />
            </div>

            <div className="lg:col-span-1">
              <WarehouseTable inventory={inventory} isLoading={isLoading} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ReorderAlerts inventory={inventory} />
            </div>

            <div className="space-y-6">
              <RecentActivity
                purchaseOrders={purchaseOrders}
                shipments={shipments}
                inventory={inventory}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Enhanced Add Item Modal */}
      {isModalOpen && (
        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddItem}
          // The formData and onInputChange props seem to be for a controlled form.
          // If AddItemModal manages its own internal state, these might not be needed.
          // I've kept them as 'any' for now, but ideally, you'd define proper types.
          formData={undefined as any}
          onInputChange={(() => {}) as any}
        />
      )}

      {/* Custom Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
    </div>
  );
}
