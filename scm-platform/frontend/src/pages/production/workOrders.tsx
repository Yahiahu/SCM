"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import {
  Hammer,
  Filter,
  Search,
  Plus,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Hourglass,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
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
  LineChart,
  Line,
  Bar,
  PieChart,
} from "recharts";

interface WorkOrder {
  id: number;
  orderNumber: string;
  description: string;
  status: "Pending" | "InProgress" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  lastUpdated: string;
  expectedDurationHours?: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#8A2BE2",
];

// Reuse background effect
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

const WorkOrdersPage: React.FC = () => {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof WorkOrder>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkOrders: WorkOrder[] = [
      {
        id: 1,
        orderNumber: "WO-001",
        description: "Perform quarterly machine maintenance on Lathe 3",
        status: "InProgress",
        priority: "High",
        assignedTo: "John Doe",
        dueDate: "2025-06-15",
        createdAt: "2025-06-01",
        lastUpdated: "2025-06-05",
        expectedDurationHours: 8,
      },
      {
        id: 2,
        orderNumber: "WO-002",
        description: "Install new software update on all production terminals",
        status: "Pending",
        priority: "Medium",
        assignedTo: "Jane Smith",
        dueDate: "2025-06-20",
        createdAt: "2025-06-03",
        lastUpdated: "2025-06-03",
        expectedDurationHours: 16,
      },
      {
        id: 3,
        orderNumber: "WO-003",
        description: "Repair conveyor belt system in Assembly Line 1",
        status: "Completed",
        priority: "Urgent",
        assignedTo: "Mike Johnson",
        dueDate: "2025-06-05",
        createdAt: "2025-06-02",
        lastUpdated: "2025-06-05",
        expectedDurationHours: 4,
      },
      {
        id: 4,
        orderNumber: "WO-004",
        description: "Routine safety inspection of facility",
        status: "Pending",
        priority: "Low",
        assignedTo: "Admin Team",
        dueDate: "2025-06-30",
        createdAt: "2025-06-04",
        lastUpdated: "2025-06-04",
        expectedDurationHours: 24,
      },
      {
        id: 5,
        orderNumber: "WO-005",
        description: "Troubleshoot network connectivity issue in Warehouse B",
        status: "Cancelled",
        priority: "High",
        assignedTo: "David Lee",
        dueDate: "2025-06-07",
        createdAt: "2025-06-03",
        lastUpdated: "2025-06-04",
        expectedDurationHours: 2,
      },
    ];

    setTimeout(() => {
      setWorkOrders(mockWorkOrders);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusDisplay = (status: WorkOrder["status"]) => {
    switch (status) {
      case "Pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Hourglass className="h-3 w-3" />,
        };
      case "InProgress":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Hammer className="h-3 w-3" />,
        };
      case "Completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "Cancelled":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-3 w-3" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  const getPriorityDisplay = (priority: WorkOrder["priority"]) => {
    switch (priority) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-orange-600";
      case "Urgent":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  const handleSort = (field: keyof WorkOrder) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedWorkOrders = [...workOrders].sort((a, b) => {
      const aValue = a[field] as any;
      const bValue = b[field] as any;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return newSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return newSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    setWorkOrders(sortedWorkOrders);
  };

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesStatus = statusFilter === "All" || wo.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || wo.priority === priorityFilter;
    const matchesSearch =
      searchTerm === "" ||
      wo.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const woStats = {
    totalWorkOrders: workOrders.length,
    pendingWorkOrders: workOrders.filter((wo) => wo.status === "Pending")
      .length,
    inProgressWorkOrders: workOrders.filter((wo) => wo.status === "InProgress")
      .length,
    completedWorkOrders: workOrders.filter((wo) => wo.status === "Completed")
      .length,
    cancelledWorkOrders: workOrders.filter((wo) => wo.status === "Cancelled")
      .length,
  };

  const workOrderStatusData = [
    { name: "Pending", value: woStats.pendingWorkOrders },
    { name: "In Progress", value: woStats.inProgressWorkOrders },
    { name: "Completed", value: woStats.completedWorkOrders },
    { name: "Cancelled", value: woStats.cancelledWorkOrders },
  ];

  const workOrderPriorityData = workOrders.reduce((acc, wo) => {
    const existing = acc.find((data) => data.name === wo.priority);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: wo.priority, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleWorkOrderClick = (id: number) => {
    router.push(`/workorders/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96 z-10">
          <div className="text-red-500 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
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
                  Work Orders
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track tasks for production, maintenance, and
                  service
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <button
                  onClick={() => router.push("/workorders/new")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Work Order
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
                    Total Work Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {woStats.totalWorkOrders}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Hammer className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">
                    {woStats.inProgressWorkOrders}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Hammer className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-green-600 mt-1">
                    {woStats.completedWorkOrders}
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
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-yellow-600 mt-1">
                    {woStats.pendingWorkOrders}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Hourglass className="h-6 w-6 text-yellow-600" />
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
                  <Hammer className="h-4 w-4 mr-2" />
                  Assign Work Order
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Due Date
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by WO#, description, or assignee..."
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
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Work Orders Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("orderNumber")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>WO #</span>
                        {sortField === "orderNumber" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWorkOrders.map((wo) => {
                    const statusDisplay = getStatusDisplay(wo.status);
                    const priorityClass = getPriorityDisplay(wo.priority);
                    return (
                      <tr
                        key={wo.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleWorkOrderClick(wo.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {wo.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-1">
                            {wo.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.icon}
                            <span>{wo.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${priorityClass}`}>
                            {wo.priority}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {wo.assignedTo}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(wo.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWorkOrderClick(wo.id);
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
              Showing {filteredWorkOrders.length} of {workOrders.length} Work
              Orders
            </div>
            <div className="flex items-center space-x-4">
              <span>
                Total In Progress: {woStats.inProgressWorkOrders} | Total
                Completed: {woStats.completedWorkOrders}
              </span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Work Order Status Pie Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Work Order Status Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workOrderStatusData}
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
                      {workOrderStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-status-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Work Order Priority Bar Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Work Order Priority Breakdown
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workOrderPriorityData}
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
                      formatter={(value) => [value, "Number of Orders"]}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Work Order Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New Work Order "WO-006" created for "Emergency Server
                    Repair"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Hammer className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Work Order "WO-001" status changed to "In Progress"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Work Order "WO-003" completed by Mike Johnson
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
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

export default WorkOrdersPage;
