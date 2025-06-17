"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  fetchWarehouses,
  fetchWarehouseInventory,
  fetchComponents,
  fetchShippingInfo,
  deleteWarehouseInventory,
} from "../services/api";
import { HeaderSection } from "../components/warehouse/HeaderSection";
import { AlertsSection } from "../components/warehouse/AlertSection";
import { StatsCards } from "../components/warehouse/StatsCard";
import { InventoryTable } from "../components/warehouse/InventoryTable";
import { QuickActionsCard } from "../components/warehouse/QuickActionsCard";
import { ShipmentsCard } from "../components/warehouse/ShipmentsCard";
import { AddInventoryModal } from "../components/warehouse/AddInventoryModal";
import {
  InventoryItem,
  IncomingShipment,
  WarehouseLocation,
} from "../components/warehouse/types";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

export default function WarehousePage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [incoming, setIncoming] = useState<IncomingShipment[]>([]);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [components, setComponents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    componentId: "",
    warehouseId: "",
    currentQty: "",
    incomingQty: "",
    outgoingQty: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [warehouses, warehouseInventory, allComponents, shippingInfos] =
        await Promise.all([
          fetchWarehouses(),
          fetchWarehouseInventory(),
          fetchComponents(),
          fetchShippingInfo(),
        ]);

      setLocations(warehouses);
      setComponents(allComponents);

      const mappedInventory = warehouseInventory.map((item: any) => ({
        id: item.id,
        componentId: item.componentId,
        warehouseId: item.warehouseId,
        currentQty: item.current_qty,
        incomingQty: item.incoming_qty,
        outgoingQty: item.outgoing_qty,
        component: {
          num: item.component?.num || "",
          description: item.component?.description || "",
          supplierPartNumber: item.component?.supplier_part_number || "",
          supplier: {
            name: item.component?.supplier?.name || "Unknown",
          },
        },
        warehouse: {
          name: item.warehouse?.name || "Unknown",
          location: item.warehouse?.location || "",
        },
      }));
      setInventory(mappedInventory);

      const mappedIncoming = shippingInfos.map((shipment: any) => ({
        id: shipment.id,
        poId: shipment.poId,
        componentId: shipment.componentId,
        qty: shipment.qty,
        origin: shipment.origin,
        destination: shipment.destination,
        carrier: shipment.carrier,
        trackingNumber: shipment.tracking_number || "",
        estimatedArrival: shipment.estimated_arrival,
        status: shipment.status,
        component: {
          description: shipment.component?.description || "",
        },
        purchaseOrder: {
          supplier: {
            name: shipment.po?.supplier?.name || "Unknown",
          },
        },
      }));
      setIncoming(mappedIncoming);

      toast({ title: "Data Refreshed" });
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast({
        title: "Error",
        description: "Failed to load warehouse data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await refreshData();
      toast({ title: "Inventory item added" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create inventory item:", error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
    }
  };

  const updateItemQuantity = async (id: number, newQuantity: number) => {
    try {
      await refreshData();
      toast({ title: "Quantity updated" });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await deleteWarehouseInventory(id);
      await refreshData();
      toast({ title: "Item deleted" });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleViewLocation = (locationId: number) => {
    router.push(`/locations/${locationId}`);
  };

  const totalItems = inventory.length;
  const outOfStockItems = inventory.filter(
    (item) => item.currentQty <= 0
  ).length;
  const delayedIncoming = incoming.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;
  const utilizationPercentage = 75;
  const processingOutgoing = 0;

  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.component.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.component.num.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase());

      const status =
        item.currentQty <= 0
          ? "Out of Stock"
          : item.currentQty < 10
          ? "Low Stock"
          : "In Stock";

      switch (activeTab) {
        case 0:
          return matchesSearch;
        case 1:
          return matchesSearch && status === "In Stock";
        case 2:
          return matchesSearch && status === "Low Stock";
        case 3:
          return matchesSearch && status === "Out of Stock";
        case 4:
          return matchesSearch && item.currentQty < 10;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) =>
      a.component.description.localeCompare(b.component.description)
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Adjusted grid pattern to be slightly less opaque */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      <Navbar isLoggedIn={true} />

      {/* Main content area - now explicitly bg-sky-50 for its children */}
      <main className="flex-1 pt-20 px-6 z-10">
        {" "}
        {/* Added z-10 for layering */}
        <div className="flex flex-col gap-0">
          {/* HeaderSection - wrapped with bg-sky-50 */}
          <div className="p-4 rounded-lg bg-sky-50 ">
            <HeaderSection
              onOpen={() => setIsModalOpen(true)}
              refreshData={refreshData}
              isLoading={isLoading}
            />
          </div>

          {/* AlertsSection - wrapped with bg-sky-50 */}
          <div className="p-6 rounded-lg">
            <AlertsSection
              outOfStockItems={outOfStockItems}
              delayedIncoming={delayedIncoming}
            />
          </div>

          {/* StatsCards - wrapped with bg-sky-50 */}
          <div className="p-2 rounded-lg">
            <StatsCards
              totalItems={totalItems}
              utilizationPercentage={utilizationPercentage}
              processingOutgoing={processingOutgoing}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-0">
            <div className="flex-1 overflow-x-auto max-w-full">
              {/* InventoryTable - wrapped with bg-sky-50 */}
              <div className="p-0 rounded-lg mr-2">
                <InventoryTable
                  isLoading={isLoading}
                  inventory={inventory}
                  filteredInventory={filteredInventory}
                  activeTab={activeTab}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setActiveTab={setActiveTab}
                  updateItemQuantity={updateItemQuantity}
                  deleteItem={deleteItem}
                  handleViewLocation={handleViewLocation}
                  router={router}
                  onRowClick={(id) => router.push(`/inventory/${id}`)} // ✅ This enables the row click
                />
              </div>
            </div>
            <div className="w-full lg:w-[30%] space-y-6 flex flex-col">
              {" "}
              {/* Added flex-col to enable gap on children */}
              {/* QuickActionsCard - wrapped with bg-sky-50 */}
              <div className="p-0 rounded-lg">
                <QuickActionsCard />
              </div>
              {/* ShipmentsCard - wrapped with bg-sky-50 */}
              <div className="p-0 rounded-lg">
                <ShipmentsCard incoming={incoming} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        components={components}
        locations={locations}
      />
    </div>
  );
}
