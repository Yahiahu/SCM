import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaWarehouse,
  FaTruck,
  FaBoxOpen,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaBell,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExchangeAlt,
  FaArrowRight,
} from "react-icons/fa";
import { GiFactory } from "react-icons/gi";
import { MdInventory, MdOutlineSecurity } from "react-icons/md";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

const SupplyChainDashboard = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  // Sample data
  const inventoryItems = [
    {
      id: "SKU-1001",
      name: "Widget A",
      quantity: 245,
      location: "WH-1-A12",
      status: "In Stock",
    },
    {
      id: "SKU-1002",
      name: "Gadget B",
      quantity: 89,
      location: "WH-2-B05",
      status: "Low Stock",
    },
    {
      id: "SKU-1003",
      name: "Component C",
      quantity: 532,
      location: "WH-1-C22",
      status: "In Stock",
    },
    {
      id: "SKU-1004",
      name: "Part D",
      quantity: 0,
      location: "WH-3-D14",
      status: "Out of Stock",
    },
  ];

  const shipments = [
    {
      id: "SH-1001",
      origin: "Factory A",
      destination: "Warehouse 1",
      status: "In Transit",
      eta: "2023-06-15",
    },
    {
      id: "SH-1002",
      origin: "Supplier B",
      destination: "Factory A",
      status: "Delayed",
      eta: "2023-06-18",
    },
    {
      id: "SH-1003",
      origin: "Warehouse 2",
      destination: "Retail Store",
      status: "Delivered",
      eta: "2023-06-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(140,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-lg bg-white/80 border-b border-sky-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-md">
              <FaWarehouse className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              SupplyChainPro
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-md border border-sky-200/50 shadow-sm hover:shadow-md transition-all">
              <FaBell className="text-gray-600 w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 p-2 rounded-full bg-white/80 backdrop-blur-md border border-sky-200/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                <FaUserCircle className="text-white w-5 h-5" />
              </div>
              <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <div className="relative flex-1 min-w-[300px] group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-sky-500 transition-colors">
              <FaSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 bg-white/80 border border-sky-200/70 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/70 backdrop-blur-sm transition-all shadow-sm"
              placeholder="Search inventory, shipments..."
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            <select className="appearance-none w-48 pl-10 pr-8 py-3 bg-white/80 border border-sky-200/70 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/70 backdrop-blur-sm shadow-sm cursor-pointer">
              <option>All Locations</option>
              <option>Warehouse 1</option>
              <option>Warehouse 2</option>
              <option>Factory A</option>
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-sky-500 transition-colors">
              <FaMapMarkerAlt className="w-5 h-5" />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            <select className="appearance-none w-48 pl-10 pr-8 py-3 bg-white/80 border border-sky-200/70 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/70 backdrop-blur-sm shadow-sm cursor-pointer">
              <option>All Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-sky-500 transition-colors">
              <FaFilter className="w-5 h-5" />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </motion.div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-sky-100/50 border border-sky-200/50">
                <MdInventory className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-gray-500 font-medium">Total Inventory</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">1,248</p>
                <p className="text-sm text-gray-500">items</p>
              </div>
              <div className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                ↑ 12%
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100/50 border border-blue-200/50">
                <FaTruck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-500 font-medium">Active Shipments</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">17</p>
                <p className="text-sm text-gray-500">in transit</p>
              </div>
              <div className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center">
                ↓ 3 delayed
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-100/50 border border-amber-200/50">
                <FaChartLine className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-gray-500 font-medium">Order Accuracy</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">98.7%</p>
                <p className="text-sm text-gray-500">accuracy</p>
              </div>
              <div className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                ↑ 1.2%
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-100/50 border border-purple-200/50">
                <FaWarehouse className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-500 font-medium">Warehouse Capacity</h3>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-800">78%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">22% available</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inventory Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-100/50 border border-sky-200/50">
                    <MdInventory className="w-6 h-6 text-sky-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Inventory Overview
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  View All <FaArrowRight className="w-3 h-3" />
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sky-200/50">
                      <th className="pb-3 text-left text-gray-600 font-medium">
                        SKU
                      </th>
                      <th className="pb-3 text-left text-gray-600 font-medium">
                        Item
                      </th>
                      <th className="pb-3 text-left text-gray-600 font-medium">
                        Qty
                      </th>
                      <th className="pb-3 text-left text-gray-600 font-medium">
                        Location
                      </th>
                      <th className="pb-3 text-left text-gray-600 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-200/30">
                    {inventoryItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-sky-50/50 transition-colors"
                      >
                        <td className="py-4 font-medium text-gray-800">
                          {item.id}
                        </td>
                        <td className="py-4 text-gray-700">{item.name}</td>
                        <td className="py-4 text-gray-700">{item.quantity}</td>
                        <td className="py-4 text-gray-700">{item.location}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.status === "In Stock"
                                ? "bg-green-100/80 text-green-800"
                                : item.status === "Low Stock"
                                ? "bg-amber-100/80 text-amber-800"
                                : "bg-red-100/80 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Shipment Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100/50 border border-blue-200/50">
                    <FaTruck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Shipment Tracking
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  View All <FaArrowRight className="w-3 h-3" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <motion.div
                    key={shipment.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-xl border border-sky-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {shipment.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {shipment.origin} → {shipment.destination}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium mb-1 ${
                            shipment.status === "Delivered"
                              ? "bg-green-100/80 text-green-800"
                              : shipment.status === "Delayed"
                              ? "bg-red-100/80 text-red-800"
                              : "bg-blue-100/80 text-blue-800"
                          }`}
                        >
                          {shipment.status}
                        </span>
                        <p className="text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1" /> ETA: {shipment.eta}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          shipment.status === "Delivered"
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : shipment.status === "Delayed"
                            ? "bg-gradient-to-r from-red-400 to-red-600"
                            : "bg-gradient-to-r from-blue-400 to-blue-600"
                        }`}
                        style={{
                          width:
                            shipment.status === "Delivered"
                              ? "100%"
                              : shipment.status === "Delayed"
                              ? "60%"
                              : "80%",
                        }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Supply Chain Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100/50 border border-purple-200/50">
                    <FaMapMarkerAlt className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Network Map
                  </h2>
                </div>
              </div>

              <div className="bg-gradient-to-br from-sky-100/50 to-blue-100/50 h-48 rounded-xl flex items-center justify-center mb-6 border border-sky-200/30">
                <div className="text-center">
                  <div className="animate-spin mb-2">
                    <svg
                      className="w-8 h-8 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-gray-500">Loading network visualization</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
                  <div className="p-2 rounded-lg bg-orange-100/50 border border-orange-200/50">
                    <GiFactory className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      2 Active Factories
                    </p>
                    <p className="text-sm text-gray-500">Operating normally</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
                  <div className="p-2 rounded-lg bg-blue-100/50 border border-blue-200/50">
                    <FaWarehouse className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">3 Warehouses</p>
                    <p className="text-sm text-gray-500">
                      78% average capacity
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
                  <div className="p-2 rounded-lg bg-green-100/50 border border-green-200/50">
                    <FaTruck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      17 In-Transit Shipments
                    </p>
                    <p className="text-sm text-gray-500">3 delayed</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100/50 border border-amber-200/50">
                    <FaExchangeAlt className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Activity
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  View All <FaArrowRight className="w-3 h-3" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
                  <p className="font-medium text-gray-800">Inventory Update</p>
                  <p className="text-sm text-gray-600">
                    SKU-1002 quantity updated to 89
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>

                <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
                  <p className="font-medium text-gray-800">Shipment Delayed</p>
                  <p className="text-sm text-gray-600">
                    SH-1002 delayed by 2 days
                  </p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>

                <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
                  <p className="font-medium text-gray-800">New Order</p>
                  <p className="text-sm text-gray-600">
                    Order #45678 placed for Retail Store
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>
            </motion.div>

            {/* Security Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-red-50/80 to-white/80 backdrop-blur-xl border border-red-200/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100/50 border border-red-200/50">
                  <MdOutlineSecurity className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Security Alerts
                </h2>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100/80 text-green-800 text-sm font-medium">
                  Secure
                </span>
                <p className="text-sm text-gray-600">
                  All systems operating normally
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplyChainDashboard;
