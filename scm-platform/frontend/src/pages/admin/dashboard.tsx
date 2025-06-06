import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  ShieldCheck, // Admin/Security
  Users, // Users
  Package, // Purchase Orders
  Truck, // Fulfillment
  Layers, // BOMs
  Hammer, // Work Orders
  Brain, // AI Insights
  FileText, // Audit Log
  Download,
  Plus,
  ArrowRight,
  AlertCircle,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Bar } from "recharts";

// --- Interfaces for Admin Dashboard Data ---
interface AdminDashboardSummary {
  totalUsers: number;
  activeOrganizations: number;
  // Purchase Order Stats
  totalPurchaseOrders: number;
  outstandingPurchaseOrders: number;
  totalPurchaseOrderValue: number;
  // Fulfillment Stats
  shipmentsInTransit: number;
  totalDeliveredShipments: number;
  totalReturnOrders: number;
  // BOM Stats
  totalBOMs: number;
  activeBOMs: number;
  // Work Order Stats
  totalWorkOrders: number;
  workOrdersInProgress: number;
  workOrdersCompleted: number;
  // AI Insights Stats
  totalAnomalies: number;
  criticalAnomalies: number;
  openSuggestions: number;
}

interface AuditLogEntry {
  id: number;
  entity_type: string;
  entity_id: number;
  action_type: string;
  actorId: number;
  timestamp: string;
  change_summary: string;
  actorUsername?: string; // Assuming we can fetch this or it's provided
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#8A2BE2",
  "#8DD1E1",
  "#C70039",
];

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const [dashboardSummary, setDashboardSummary] =
    useState<AdminDashboardSummary | null>(null);
  const [recentAuditLogs, setRecentAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Placeholder Data Fetching Functions ---
  const fetchDashboardSummary = async () => {
    console.log("Fetching admin dashboard summary...");
    // In a real app: const response = await fetch("/api/admin/dashboard-summary");
    // const data = await response.json();
    // setDashboardSummary(data);
  };

  const fetchRecentAuditLogs = async () => {
    console.log("Fetching recent audit logs...");
    // In a real app: const response = await fetch("/api/auditlog?limit=5");
    // const data = await response.json();
    // setRecentAuditLogs(data);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      // Simulate API calls with mock data
      await Promise.all([fetchDashboardSummary(), fetchRecentAuditLogs()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // --- Mock Data for Demonstration (remove in production) ---
  useEffect(() => {
    const mockSummary: AdminDashboardSummary = {
      totalUsers: 50,
      activeOrganizations: 5,
      totalPurchaseOrders: 150,
      outstandingPurchaseOrders: 35,
      totalPurchaseOrderValue: 750000,
      shipmentsInTransit: 12,
      totalDeliveredShipments: 250,
      totalReturnOrders: 8,
      totalBOMs: 75,
      activeBOMs: 60,
      totalWorkOrders: 90,
      workOrdersInProgress: 25,
      workOrdersCompleted: 40,
      totalAnomalies: 15,
      criticalAnomalies: 3,
      openSuggestions: 7,
    };

    const mockAuditLogs: AuditLogEntry[] = [
      {
        id: 1,
        entity_type: "PurchaseOrder",
        entity_id: 1001,
        action_type: "create",
        actorId: 1,
        timestamp: "2025-06-05T14:30:00Z",
        change_summary: "New PO created for Alpha Components",
        actorUsername: "testuser",
      },
      {
        id: 2,
        entity_type: "WorkOrder",
        entity_id: 5,
        action_type: "update",
        actorId: 2,
        timestamp: "2025-06-05T10:15:00Z",
        change_summary: "Work Order WO-005 status changed to InProgress",
        actorUsername: "admin_user",
      },
      {
        id: 3,
        entity_type: "Supplier",
        entity_id: 2,
        action_type: "update",
        actorId: 1,
        timestamp: "2025-06-04T17:00:00Z",
        change_summary: "Supplier Beta Electronics contact email updated",
        actorUsername: "testuser",
      },
      {
        id: 4,
        entity_type: "AnomalyLog",
        entity_id: 1,
        action_type: "detect",
        actorId: -1, // System
        timestamp: "2025-06-04T09:00:00Z",
        change_summary:
          "High severity anomaly detected in Component 123 demand",
        actorUsername: "System (AI)",
      },
      {
        id: 5,
        entity_type: "User",
        entity_id: 4,
        action_type: "create",
        actorId: 2,
        timestamp: "2025-06-03T11:45:00Z",
        change_summary: "New user 'staff_ft' created",
        actorUsername: "admin_user",
      },
    ];

    setTimeout(() => {
      setDashboardSummary(mockSummary);
      setRecentAuditLogs(mockAuditLogs);
      setLoading(false);
    }, 500); // Simulate network delay
  }, []);

  // --- Chart Data (derived from summary) ---
  const orderStatusData = dashboardSummary
    ? [
        {
          name: "Outstanding POs",
          value: dashboardSummary.outstandingPurchaseOrders,
        },
        {
          name: "Completed/Received POs",
          value:
            dashboardSummary.totalPurchaseOrders -
            dashboardSummary.outstandingPurchaseOrders,
        },
      ]
    : [];

  const woStatusData = dashboardSummary
    ? [
        {
          name: "In Progress WOs",
          value: dashboardSummary.workOrdersInProgress,
        },
        { name: "Completed WOs", value: dashboardSummary.workOrdersCompleted },
        {
          name: "Other WOs",
          value:
            dashboardSummary.totalWorkOrders -
            dashboardSummary.workOrdersInProgress -
            dashboardSummary.workOrdersCompleted,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-600 mx-auto mb-4"></div>
            <p className="text-sky-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96 relative z-10">
          <div className="text-red-500 text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sky-200 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse delay-300"></div>
      <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 animate-pulse delay-700"></div>

      <Navbar isLoggedIn={true} />

      {/* Main Content */}
      <div className="p-8 pt-20 relative z-10">
        {/* Header with Glassmorphism Effect */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Centralized overview of system health and key operations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <Download className="h-4 w-4 mr-2" />
                Export Dashboard Data
              </button>
              <button
                onClick={() => router.push("/admin/settings")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-sky-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin Settings
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardSummary && (
            <>
              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Active Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardSummary.totalUsers}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 group-hover:from-sky-200 group-hover:to-sky-300 transition-all duration-300">
                    <Users className="h-8 w-8 text-sky-600" />
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total In-Transit Shipments
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {dashboardSummary.shipmentsInTransit}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                    <Truck className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Outstanding Purchase Orders
                    </p>
                    <p className="text-3xl font-bold text-amber-600">
                      {dashboardSummary.outstandingPurchaseOrders}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                    <Package className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Critical AI Anomalies
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {dashboardSummary.criticalAnomalies}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions with Glassmorphism */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Admin Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/90 transition-all duration-300 hover:shadow-md hover:scale-105">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/90 transition-all duration-300 hover:shadow-md hover:scale-105">
                <FileText className="h-4 w-4 mr-2" />
                View Full Audit Log
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/90 transition-all duration-300 hover:shadow-md hover:scale-105">
                <Brain className="h-4 w-4 mr-2" />
                Configure AI Models
              </button>
            </div>
          </div>
        </div>

        {/* Module-Specific Overviews with Enhanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Purchase Orders Overview */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 mr-3">
                  <Package className="h-6 w-6 text-sky-600" />
                </div>
                Purchase Orders
              </h3>
              <button
                onClick={() => router.push("/orders")}
                className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-all duration-300 hover:scale-105"
              >
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            {dashboardSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">Total POs:</span>
                  <span className="font-bold text-gray-900">
                    {dashboardSummary.totalPurchaseOrders}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">
                    Outstanding POs:
                  </span>
                  <span className="font-bold text-amber-600">
                    {dashboardSummary.outstandingPurchaseOrders}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">Total Value:</span>
                  <span className="font-bold text-green-600">
                    {dashboardSummary.totalPurchaseOrderValue.toLocaleString(
                      "en-US",
                      { style: "currency", currency: "USD" }
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available.</p>
            )}
            {dashboardSummary && orderStatusData.length > 0 && (
              <div className="h-48 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell key={`cell-po-0`} fill={COLORS[2]} />
                      <Cell key={`cell-po-1`} fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Logistics Overview */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 mr-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                Logistics & Fulfillment
              </h3>
              <button
                onClick={() => router.push("/fulfillment")}
                className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-all duration-300 hover:scale-105"
              >
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            {dashboardSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">
                    Shipments In Transit:
                  </span>
                  <span className="font-bold text-blue-600">
                    {dashboardSummary.shipmentsInTransit}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">
                    Delivered Shipments:
                  </span>
                  <span className="font-bold text-green-600">
                    {dashboardSummary.totalDeliveredShipments}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">
                    Total Return Orders:
                  </span>
                  <span className="font-bold text-red-600">
                    {dashboardSummary.totalReturnOrders}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available.</p>
            )}
          </div>

          {/* BOMs Overview */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 mr-3">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                Bill of Materials
              </h3>
              <button
                onClick={() => router.push("/bom")}
                className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-all duration-300 hover:scale-105"
              >
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            {dashboardSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">Total BOMs:</span>
                  <span className="font-bold text-gray-900">
                    {dashboardSummary.totalBOMs}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">Active BOMs:</span>
                  <span className="font-bold text-green-600">
                    {dashboardSummary.activeBOMs}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">
                    Avg. Component Cost:
                  </span>
                  <span className="font-bold text-blue-600">$XX.XX</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available.</p>
            )}
          </div>

          {/* Work Orders Overview */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 mr-3">
                  <Hammer className="h-6 w-6 text-orange-600" />
                </div>
                Work Orders
              </h3>
              <button
                onClick={() => router.push("/workorders")}
                className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-all duration-300 hover:scale-105"
              >
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            {dashboardSummary ? (
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">Total WOs:</span>
                  <span className="font-bold text-gray-900">
                    {dashboardSummary.totalWorkOrders}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">
                    In Progress WOs:
                  </span>
                  <span className="font-bold text-blue-600">
                    {dashboardSummary.workOrdersInProgress}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl">
                  <span className="text-sm text-gray-700">Completed WOs:</span>
                  <span className="font-bold text-green-600">
                    {dashboardSummary.workOrdersCompleted}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available.</p>
            )}
            {dashboardSummary && woStatusData.length > 0 && (
              <div className="h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={woStatusData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="url(#gradient)" name="Count" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1d4ed8"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-200 mr-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              AI Insights & Anomalies
            </h3>
            <button
              onClick={() => router.push("/ai-insights")}
              className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-all duration-300 hover:scale-105"
            >
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          {dashboardSummary ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-100">
                <p className="text-sm text-purple-800 mb-1">Total Anomalies</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardSummary.totalAnomalies}
                </p>
                <p className="text-xs text-purple-500 mt-1">
                  Detected in last 30 days
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-100">
                <p className="text-sm text-red-800 mb-1">Critical Anomalies</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardSummary.criticalAnomalies}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  Requires immediate attention
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 mb-1">Open Suggestions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardSummary.openSuggestions}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  AI-generated recommendations
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No AI insights available.</p>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mr-3">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              Recent Audit Activity
            </h3>
            <button
              onClick={() => router.push("/audit-log")}
              className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-all duration-300 hover:scale-105"
            >
              View Full Log <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          {recentAuditLogs.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Entity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.action_type === "create"
                              ? "bg-green-100 text-green-800"
                              : log.action_type === "update"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {log.action_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.entity_type}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{log.entity_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {log.change_summary}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {log.actorUsername}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent audit logs found.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;