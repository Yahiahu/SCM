"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import {
  Package,
  Filter,
  Search,
  Calendar,
  Plus,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Scissors,
  Layers,
  DollarSign,
  AlertCircle,
  CheckCircle,
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

interface BillOfMaterial {
  id: number;
  productId: number;
  productName: string;
  version: string;
  status: "Draft" | "Active" | "Archived";
  createdAt: string;
  lastUpdated: string;
  totalCost?: number;
}

interface BomItem {
  id: number;
  bomId: number;
  componentId: number;
  componentName: string;
  quantity: number;
  unitOfMeasure: string;
  costPerUnit: number;
}

interface BomStats {
  totalBoms: number;
  activeBoms: number;
  draftBoms: number;
  archivedBoms: number;
  totalComponents: number;
  totalBOMValue: number;
}

interface BomActivity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  bomId?: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#8A2BE2",
];

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

const BomPage: React.FC = () => {
  const router = useRouter();
  const [boms, setBoms] = useState<BillOfMaterial[]>([]);
  const [bomItems, setBomItems] = useState<BomItem[]>([]);
  const [bomStats, setBomStats] = useState<BomStats>({
    totalBoms: 0,
    activeBoms: 0,
    draftBoms: 0,
    archivedBoms: 0,
    totalComponents: 0,
    totalBOMValue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<BomActivity[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof BillOfMaterial>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetchBomData();
  }, []);

  const fetchBomData = async () => {
    try {
      setLoading(true);

      const bomsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bom`);

      if (!bomsRes.ok) throw new Error("Failed to fetch BOM data");

      const bomsData = await bomsRes.json();

      // You can generate stats/activity client-side from bomsData
      const statsData: BomStats = {
        totalBoms: bomsData.length,
        activeBoms: bomsData.filter((b: any) => b.status === "Active").length,
        draftBoms: bomsData.filter((b: any) => b.status === "Draft").length,
        archivedBoms: bomsData.filter((b: any) => b.status === "Archived").length,
        totalComponents: bomsData.length, // or count unique components if needed
        totalBOMValue: bomsData.reduce(
          (sum: number, b: any) => sum + (b.totalCost || 0),
          0
        ),
      };


      const activityData = bomsData.slice(0, 5).map((b: any, i: number) => ({
        id: i,
        type: "creation",
        message: `Component ${b.component.num} added to ${b.product.name}`,
        timestamp: b.created_at ?? new Date().toISOString(),
      }));

      setBoms(bomsData);
      setBomItems(bomsData); // or split if needed
      setBomStats(statsData);
      setRecentActivity(activityData);
      setLoading(false);
    } catch (err: any) {
      setError(`Failed to fetch BOM data: ${err.message}`);
      console.error("Error fetching BOM data:", err);
      setLoading(false);
    }
  };


  const getStatusDisplay = (status: BillOfMaterial["status"]) => {
    switch (status) {
      case "Active":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "Draft":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case "Archived":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Package className="h-3 w-3" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "creation":
        return <Plus className="h-4 w-4 text-blue-600" />;
      case "update":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "status-change":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Layers className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleSort = (field: keyof BillOfMaterial) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedBoms = [...boms].sort((a, b) => {
      const aValue = a[field] as any;
      const bValue = b[field] as any;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return newSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return newSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    setBoms(sortedBoms);
  };

  const filteredBoms = boms.filter((bom) => {
    const matchesStatus = statusFilter === "All" || bom.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      bom.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.id.toString().includes(searchTerm) ||
      bom.productId.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const bomStatusData = [
    { name: "Active", value: bomStats.activeBoms },
    { name: "Draft", value: bomStats.draftBoms },
    { name: "Archived", value: bomStats.archivedBoms },
  ];

  const componentUsageData = bomItems.reduce((acc, item) => {
    const existing = acc.find((data) => data.name === item.componentName);
    if (existing) {
      existing.value += item.quantity;
    } else {
      acc.push({ name: item.componentName, value: item.quantity });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleBomClick = (id: number) => {
    router.push(`/bom/${id}`);
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
                  Bill of Materials (BOMs)
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track product compositions and costs
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <button
                  onClick={() => router.push("/bom/new")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New BOM
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
                    Total BOMs
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {bomStats.totalBoms}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active BOMs
                  </p>
                  <p className="text-2xl font-semibold text-green-600 mt-1">
                    {bomStats.activeBoms}
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
                    Draft BOMs
                  </p>
                  <p className="text-2xl font-semibold text-yellow-600 mt-1">
                    {bomStats.draftBoms}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total BOM Value
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    ${bomStats.totalBOMValue.toLocaleString()}
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
                  Add Component
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Layers className="h-4 w-4 mr-2" />
                  Manage Products
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export All BOMs
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
                placeholder="Search BOMs or products..."
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
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* BOMs Table */}
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
                        <span>BOM ID</span>
                        {sortField === "id" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("productName")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Product Name</span>
                        {sortField === "productName" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBoms.map((bom) => {
                    const statusDisplay = getStatusDisplay(bom.status);
                    return (
                      <tr
                        key={bom.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleBomClick(bom.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{bom.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Layers className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {bom.productName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {bom.version}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.icon}
                            <span>{bom.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${bom.totalCost?.toLocaleString() || "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bom.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBomClick(bom.id);
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
              Showing {filteredBoms.length} of {boms.length} BOMs
            </div>
            <div className="flex items-center space-x-4">
              <span>
                Total Value Across All BOMs: $
                {bomStats.totalBOMValue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* BOM Status Pie Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                BOM Status Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bomStatusData}
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
                      {bomStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-bom-status-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Components by Usage (Bar Chart) */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Component Usage Across BOMs
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={componentUsageData}
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
                    <Tooltip formatter={(value) => [value, "Quantity Used"]} />
                    <Legend />
                    <Bar dataKey="value" name="Quantity" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent BOM Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-3 bg-blue-50 rounded-lg"
                >
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BomPage;
