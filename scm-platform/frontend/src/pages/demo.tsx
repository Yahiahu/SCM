import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BlurredBackground from "../components/demo/BlurredBackground";
import SearchFilters from "../components/demo/SearchFilters";
import KeyMetrics from "../components/demo/KeyMetrics";
import InventoryOverview from "../components/demo/InventoryOverview";
import ShipmentTracking from "../components/demo/ShipmentTracking";
import NetworkMap from "../components/demo/NetworkMap";
import RecentActivity from "../components/demo/RecentActivity";
import SecurityAlerts from "../components/demo/SecurityAlerts";

const SupplyChainDashboard = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(140,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <main className="relative z-10 container mx-auto px-6 py-8 pt-20">
        {/* Search and Filters */}
        <SearchFilters />

        {/* Key Metrics */}
        <KeyMetrics />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <InventoryOverview />
            <ShipmentTracking />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <NetworkMap />
            <RecentActivity />
            <SecurityAlerts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupplyChainDashboard;
