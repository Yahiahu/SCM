"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
  DollarSign,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PurchaseOrder {
  id: number;
  supplierId: number;
  createdById: number;
  status: string;
  date_created: string;
  date_expected: string;
  date_received?: string;
  supplierName?: string;
  total?: number;
}

interface Supplier {
  id: number;
  name: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Reuse background effect
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

const Orders: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof PurchaseOrder>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders: PurchaseOrder[] = [
      {
        id: 1001,
        supplierId: 1,
        createdById: 1,
        status: "Ordered",
        date_created: "2025-06-01",
        date_expected: "2025-06-15",
        supplierName: "Acme Supplies Inc.",
        total: 15420.5,
      },
      {
        id: 1002,
        supplierId: 2,
        createdById: 1,
        status: "Received",
        date_created: "2025-05-28",
        date_expected: "2025-06-10",
        date_received: "2025-06-08",
        supplierName: "Global Manufacturing Co.",
        total: 8950.0,
      },
      {
        id: 1003,
        supplierId: 3,
        createdById: 2,
        status: "Draft",
        date_created: "2025-06-05",
        date_expected: "2025-06-20",
        supplierName: "Tech Components Ltd.",
        total: 22150.75,
      },
      {
        id: 1004,
        supplierId: 1,
        createdById: 1,
        status: "Ordered",
        date_created: "2025-06-03",
        date_expected: "2025-06-18",
        supplierName: "Acme Supplies Inc.",
        total: 5670.25,
      },
      {
        id: 1005,
        supplierId: 4,
        createdById: 3,
        status: "Received",
        date_created: "2025-05-25",
        date_expected: "2025-06-05",
        date_received: "2025-06-04",
        supplierName: "Premium Parts Co.",
        total: 31200.0,
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1);
  }, []);

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Ordered":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Clock className="h-3 w-3" />,
        };
      case "Received":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "Draft":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  // Handle sorting
  const handleSort = (field: keyof PurchaseOrder) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedOrders = [...orders].sort((a, b) => {
      const aValue = a[field] || "";
      const bValue = b[field] || "";
      if (newSortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    setOrders(sortedOrders);
  };

  // Handle filtering and searching
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    ordered: orders.filter((o) => o.status === "Ordered").length,
    received: orders.filter((o) => o.status === "Received").length,
    draft: orders.filter((o) => o.status === "Draft").length,
    totalValue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
  };

  // Prepare data for charts
  const statusData = [
    { name: "Ordered", value: stats.ordered },
    { name: "Received", value: stats.received },
    { name: "Draft", value: stats.draft },
  ];

  const supplierData = orders.reduce((acc, order) => {
    const existing = acc.find((item) => item.name === order.supplierName);
    if (existing) {
      existing.value += order.total || 0;
    } else {
      acc.push({
        name: order.supplierName || "Unknown",
        value: order.total || 0,
      });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Handle row click
  const handleRowClick = (id: number) => {
    router.push(`/orders/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-800 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-800 text-lg">
        <div className="text-red-500 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Purchase Orders
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track your supply chain orders
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>
                  <p className="text-2xl font-semibold text-yellow-600 mt-1">
                    {stats.ordered}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-green-600 mt-1">
                    {stats.received}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Value
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    ${stats.totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <DollarSign className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Suppliers
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Ordered">Ordered</option>
                <option value="Received">Received</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("id")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Order ID</span>
                        {sortField === "id" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("supplierName")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Supplier</span>
                        {sortField === "supplierName" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("date_created")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Created</span>
                        {sortField === "date_created" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const statusDisplay = getStatusDisplay(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(order.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.supplierName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.icon}
                            <span>{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${order.total?.toLocaleString() || "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date_created).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date_expected).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(order.id);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 mb-6 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="flex items-center space-x-4">
              <span>Total Value: ${stats.totalValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Order Status Pie Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Status Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Supplier Value Bar Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Value by Supplier
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={supplierData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Total Value"]}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Total Value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #1005 received
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New order #1004 created
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
