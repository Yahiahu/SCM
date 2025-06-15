"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/components/ui/use-toast";
import {
  ShieldCheck,
  Users,
  Package,
  Truck,
  Layers,
  Hammer,
  Brain,
  FileText,
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
  Bar,
} from "recharts";

// Reuse background effect from the example
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

// --- Interfaces for Admin Dashboard Data ---
interface AdminDashboardSummary {
  totalUsers: number;
  activeOrganizations: number;
  totalPurchaseOrders: number;
  outstandingPurchaseOrders: number;
  totalPurchaseOrderValue: number;
  shipmentsInTransit: number;
  totalDeliveredShipments: number;
  totalReturnOrders: number;
  totalBOMs: number;
  activeBOMs: number;
  totalWorkOrders: number;
  workOrdersInProgress: number;
  workOrdersCompleted: number;
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
  actorUsername?: string;
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
  const toast  = useToast();
  const [dashboardSummary, setDashboardSummary] =
    useState<AdminDashboardSummary | null>(null);
  const [recentAuditLogs, setRecentAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

const loadData = async () => {
  try {
    const [summaryRes, auditLogRes] = await Promise.all([
      fetchDashboardSummary(),
      fetchRecentAuditLogs(),
    ]);

    if (!summaryRes.ok || !auditLogRes.ok) {
      throw new Error("Failed to load dashboard data.");
    }

    const summaryData = await summaryRes.json();
    const auditLogData = await auditLogRes.json();

    setDashboardSummary(summaryData);
    setRecentAuditLogs(auditLogData);
  } catch (err: any) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  const fetchDashboardSummary = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard-summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};


const fetchRecentAuditLogs = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auditlog`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching recent audit logs:", error);
    throw error;
  }
};


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

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-800 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-800 text-lg">
        <div className="text-red-500 text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!dashboardSummary) return;

    const rows = [
      ["Metric", "Value"],
      ...Object.entries(dashboardSummary).map(([key, value]) => [
        key,
        typeof value === "number" ? value.toString() : value,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_summary.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      <Navbar isLoggedIn={true} />
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />

      <main
        className={`transition-all duration-300 pt-20 relative z-10 ${
          sidebarVisible ? "ml-[180px]" : "ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
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
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2 text-blue-600" />
                  Export Dashboard Data
                </button>

                <button
                  onClick={() => router.push("/settings")}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-sky-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin Settings
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
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

          {/* Module-Specific Overviews */}
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
              {dashboardSummary && (
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
                    <span className="text-sm text-gray-700">
                      Completed WOs:
                    </span>
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
                        <linearGradient
                          id="gradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
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
                            {log.actorUsername || `User ${log.actorId}`}
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
              <p className="text-gray-500 text-sm">
                No recent audit logs found.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
