"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiInfo,
  FiCheckCircle,
  FiShoppingCart,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiLayers,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Assuming these are external components in your project
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Define ProductBundle interface
interface ProductBundle {
  id: number;
  name: string;
  description: string;
  qty: number;
  notes?: string;
  components: {
    id: number;
    num: string;
    description: string;
    required_qty: number;
    supplier_part_number?: string;
    current_qty?: number;
    unit_cost?: number;
  }[];
}

// Enhanced Toast Component with modern design
interface ToastProps {
  message: string;
  type: "success" | "error";
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-24 right-6 z-50 max-w-sm" // Adjusted top to be under Navbar
        >
          <div
            className={`
            backdrop-blur-xl border rounded-2xl shadow-xl p-4 flex items-center gap-3
            ${
              type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800" // Lighter success
                : "bg-red-50/90 border-red-200 text-red-800" // Lighter error
            }
          `}
          >
            <div
              className={`p-2 rounded-full ${
                type === "success" ? "bg-emerald-100" : "bg-red-100" // Lighter background for icon
              }`}
            >
              {type === "success" ? (
                <FiCheckCircle className="w-5 h-5 text-emerald-600" /> // Stronger icon color
              ) : (
                <FiInfo className="w-5 h-5 text-red-600" /> // Stronger icon color
              )}
            </div>
            <span className="font-medium flex-1">{message}</span>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Re-using the BlurredBackground component for consistent design
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

// Mock data for demonstration
const mockBundles: ProductBundle[] = [
  {
    id: 1,
    name: "Professional Electronics Kit",
    description: "Complete electronics bundle for professional projects",
    qty: 10,
    components: [
      {
        id: 1,
        num: "R001",
        description: "10kΩ Resistor",
        required_qty: 50,
        current_qty: 100,
        unit_cost: 0.05,
        supplier_part_number: "RES-10K-001",
      },
      {
        id: 2,
        num: "C001",
        description: "100µF Capacitor",
        required_qty: 20,
        current_qty: 15,
        unit_cost: 0.25,
        supplier_part_number: "CAP-100UF-001",
      },
      {
        id: 3,
        num: "IC001",
        description: "Arduino Uno R3",
        required_qty: 2,
        current_qty: 8,
        unit_cost: 25.0,
        supplier_part_number: "ARD-UNO-R3",
      },
    ],
  },
  {
    id: 2,
    name: "Starter Development Bundle",
    description: "Perfect bundle for beginners learning electronics",
    qty: 25,
    components: [
      {
        id: 4,
        num: "LED001",
        description: "5mm Red LED",
        required_qty: 30,
        current_qty: 200,
        unit_cost: 0.1,
        supplier_part_number: "LED-5MM-RED",
      },
      {
        id: 5,
        num: "SW001",
        description: "Push Button Switch",
        required_qty: 10,
        current_qty: 5,
        unit_cost: 0.5,
        supplier_part_number: "SW-PUSH-001",
      },
      {
        id: 6,
        num: "BR001",
        description: "Breadboard 400 tie",
        required_qty: 1,
        current_qty: 12,
        unit_cost: 3.5,
        supplier_part_number: "BB-400-001",
      },
    ],
  },
];

export default function MarketplacePage() {
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToastState({ show: true, message, type });
  };

  const hideToast = () => {
    setToastState((prev) => ({ ...prev, show: false }));
  };

  // Simulate loading and use mock data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setBundles(mockBundles);
      setSelectedBundle(mockBundles[0]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const calculateBundleCost = (bundle: ProductBundle | null) => {
    if (!bundle) {
      return { subtotal: 0, discountAmount: 0, tax: 0, total: 0 };
    }
    const subtotal = bundle.components.reduce(
      (acc, component) =>
        acc + component.required_qty * (component.unit_cost || 0),
      0
    );
    const discountAmount = 0;
    const priceAfterDiscount = subtotal - discountAmount;
    const tax = priceAfterDiscount * 0.13;
    const total = priceAfterDiscount + tax;
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  const costs = calculateBundleCost(selectedBundle);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-100/70 rounded-2xl backdrop-blur-sm border border-blue-200">
                <FiShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Product Marketplace
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and configure professional component bundles with
              real-time pricing and inventory.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Loading skeletons */}
              <div className="lg:col-span-2 space-y-6">
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg"
                  >
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-6 w-full"></div>
                      <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                          <div
                            key={j}
                            className="h-12 bg-gray-100 rounded-xl"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded-lg mb-6 w-2/3"></div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Product Bundles */}
              <div className="lg:col-span-2 space-y-6">
                {bundles.map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative group cursor-pointer transition-all duration-300
                      bg-white/60 backdrop-blur-xl border rounded-3xl p-8 shadow-lg
                      hover:bg-white/80 hover:scale-[1.01]
                      ${
                        selectedBundle?.id === bundle.id
                          ? "border-blue-400 ring-2 ring-blue-400 shadow-xl shadow-blue-200/50"
                          : "border-gray-200 hover:border-blue-200 hover:shadow-xl"
                      }
                    `}

                      onClick={() => setSelectedBundle(bundle)}
                      whileHover={{ scale: 1.005 }} // Slightly reduced hover scale
                      whileTap={{ scale: 0.995 }}   // Slightly increased tap scale
                    >
                    {/* Selection indicator */}
                    {selectedBundle?.id === bundle.id && (
                      <motion.div
                        layoutId="selectedBorder"
                        className="absolute inset-0 bg-blue-50/50 rounded-3xl border-2 border-blue-400"
                      />
                    )}

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-sky-800 mb-2 flex items-center gap-3">
                            <FiPackage className="text-blue-500" />
                            {bundle.name}
                          </h3>
                          <p className="text-gray-600 text-lg">
                            {bundle.description ||
                              bundle.notes ||
                              "Professional component bundle"}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                            <span className="text-blue-700 font-semibold">
                              {bundle.components.length} Components
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Components Table */}
                      <div className="bg-gray-50/70 rounded-2xl overflow-hidden border border-gray-100">
                        <div className="p-4 bg-gray-100 border-b border-gray-200">
                          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-600">
                            <div>Component</div>
                            <div className="col-span-2">Description</div>
                            <div className="text-center">Qty</div>
                            <div className="text-center">Unit Cost</div>
                            <div className="text-center">Stock Status</div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {bundle.components.map((component) => {
                            const stockStatus =
                              (component.current_qty || 0) >=
                              component.required_qty
                                ? {
                                    label: "In Stock",
                                    color: "emerald",
                                    icon: FiCheckCircle,
                                  }
                                : (component.current_qty || 0) > 0
                                ? {
                                    label: "Low Stock",
                                    color: "amber",
                                    icon: FiTrendingUp,
                                  }
                                : {
                                    label: "Out of Stock",
                                    color: "red",
                                    icon: FiInfo,
                                  };

                            return (
                              <div
                                key={component.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                              >
                                <div className="grid grid-cols-6 gap-4 items-center">
                                  <div className="font-mono text-blue-600 font-semibold">
                                    {component.num}
                                  </div>
                                  <div className="col-span-2">
                                    <div className="text-gray-800 font-medium">
                                      {component.description}
                                    </div>
                                    {component.supplier_part_number && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        PN: {component.supplier_part_number}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-center text-gray-800 font-semibold">
                                    {component.required_qty}
                                  </div>
                                  <div className="text-center">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                      ${(component.unit_cost || 0).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="text-center">
                                    <div
                                      className={`
                                      inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                                      ${
                                        stockStatus.color === "emerald"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : stockStatus.color === "amber"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-red-100 text-red-700"
                                      }
                                    `}
                                    >
                                      <stockStatus.icon className="w-3 h-3" />
                                      {component.current_qty || 0}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cost Breakdown Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg h-fit sticky top-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-green-100 rounded-2xl border border-green-200">
                    <FiDollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Cost Analysis
                  </h3>
                </div>

                {selectedBundle ? (
                  <motion.div
                    key={selectedBundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">
                        Selected Bundle
                      </div>
                      <div className="text-lg font-bold text-blue-800">
                        {selectedBundle.name}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="text-gray-900 text-lg font-semibold">
                          ${costs.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-700">Tax (13%):</span>
                        <span className="text-gray-900 text-lg font-semibold">
                          ${costs.tax.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-4 bg-gradient-to-r from-emerald-50/70 to-blue-50/70 rounded-2xl px-4 border border-emerald-200 shadow-md">
                        <span className="text-green-700 font-semibold text-lg">
                          Total:
                        </span>
                        <span className="text-sky-800 text-2xl font-bold">
                          ${costs.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        showToast(
                          `Purchase order generated for ${selectedBundle.name}`,
                          "success"
                        );
                      }}
                      className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-2xl font-bold text-lg
                                 hover:from-sky-600 hover:to-blue-600 transition-all duration-200
                                 shadow-xl shadow-sky-300/50 hover:shadow-2xl hover:shadow-blue-400/50
                                 border border-sky-400 flex items-center justify-center gap-3"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      Generate Purchase Order
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <FiLayers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      Select a product bundle to view cost breakdown
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Toast */}
      <Toast {...toastState} onClose={hideToast} />
    </div>
  );
}