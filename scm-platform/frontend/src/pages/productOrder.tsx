"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Loader2 } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardStats from "../components/PO/DashboardStats";
import POFilterBar from "../components/PO/POFilterBar";
import POTable from "../components/PO/POTable";
import OverduePOsCard from "../components/PO/OverduePOsCard";
import RecentActivityCard from "../components/PO/RecentActivityCard";
import CreatePOModal from "../components/PO/CreatePOModal";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchPurchaseOrders,
  fetchSuppliers,
  fetchUsers,
} from "../services/api";
import {
  PurchaseOrder,
  BackendSupplier,
  BackendUser,
} from "../components/PO/types";
import { mapBackendPOToUIPO } from "../components/PO/utils";
import { motion } from "framer-motion"; // For animations if desired

// Re-using the BlurredBackground component from your ComponentsPage
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

export default function PurchaseOrderDashboard() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<BackendSupplier[]>([]);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast  = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedSuppliers = await fetchSuppliers();
        setSuppliers(fetchedSuppliers);

        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);

        const fetchedPOs = await fetchPurchaseOrders();
        const processedPOs: PurchaseOrder[] = await Promise.all(
          fetchedPOs.map((po) =>
            mapBackendPOToUIPO(po, fetchedSuppliers, fetchedUsers)
          )
        );
        setPurchaseOrders(processedPOs);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={true} />
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-700">Loading purchase orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={true} />
        <main className="flex flex-1 items-center justify-center p-6 relative z-10">
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-md border border-red-200">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold text-red-700 mb-3">
              Error Loading Data
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-medium shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              Reload Page
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Purchase Order Dashboard
          </h1>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-medium shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create PO
          </motion.button>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-6">
          <DashboardStats purchaseOrders={purchaseOrders} />
        </div>

        {/* PO Table */}
        <div className="mb-6">
          <POTable
            purchaseOrders={purchaseOrders}
            searchTerm={searchTerm}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSearchChange={setSearchTerm}
            // If you have onDeletePO or onUpdatePOStatus, pass them here
          />
        </div>

        {/* Overdue POs and Recent Activity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <OverduePOsCard purchaseOrders={purchaseOrders} />
          <RecentActivityCard />
        </div>
      </main>

      <Footer />

      {/* Create PO Modal */}
      <CreatePOModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suppliers={suppliers}
        users={users}
        onCreatePO={(newPO) => {
          setPurchaseOrders((prevPOs) => [...prevPOs, newPO]);
          setIsModalOpen(false);
          toast({
            title: "Success!",
            description: "New Purchase Order created.",
          });
        }}
      />
    </div>
  );
}
