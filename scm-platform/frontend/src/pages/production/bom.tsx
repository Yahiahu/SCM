import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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
  Scissors, // For components/parts
  Layers, // For assembly/BOM
  DollarSign, // For cost
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

// --- Interfaces for BOM Data ---
interface BillOfMaterial {
  id: number;
  productId: number;
  productName: string; // Assuming we can get product name directly or via lookup
  version: string;
  status: "Draft" | "Active" | "Archived";
  createdAt: string;
  lastUpdated: string;
  totalCost?: number; // Calculated based on BOM items
  // Potentially include a list of bom items directly for simplified data structure
  // bomItems?: BomItem[];
}

interface BomItem {
  id: number;
  bomId: number;
  componentId: number;
  componentName: string; // Assuming component name can be resolved
  quantity: number;
  unitOfMeasure: string;
  costPerUnit: number;
  // Add other relevant fields like leadTime, supplierId, etc.
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#8A2BE2",
];

const BomPage: React.FC = () => {
  const router = useRouter();
  const [boms, setBoms] = useState<BillOfMaterial[]>([]);
  const [bomItems, setBomItems] = useState<BomItem[]>([]); // To store all items for calculations/charts
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof BillOfMaterial>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Functions ---
  const fetchBoms = async () => {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch("/api/boms");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: BillOfMaterial[] = await response.json();
      setBoms(data);
    } catch (err: any) {
      setError(`Failed to fetch BOMs: ${err.message}`);
      console.error("Error fetching BOMs:", err);
    }
  };

  const fetchBomItems = async () => {
    try {
      // Replace with your actual backend endpoint for all BOM items
      const response = await fetch("/api/bomitems");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: BomItem[] = await response.json();
      setBomItems(data);
    } catch (err: any) {
      setError(`Failed to fetch BOM items: ${err.message}`);
      console.error("Error fetching BOM items:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      // In a real application, you might fetch BOM items for a specific BOM
      // or filter them by productId after fetching BOMs.
      await Promise.all([fetchBoms(), fetchBomItems()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // --- Mock Data for Demonstration (remove in production) ---
  useEffect(() => {
    const mockBoms: BillOfMaterial[] = [
      {
        id: 1,
        productId: 101,
        productName: "Smartphone X v1.0",
        version: "1.0",
        status: "Active",
        createdAt: "2024-01-15",
        lastUpdated: "2024-05-20",
        totalCost: 250.75,
      },
      {
        id: 2,
        productId: 102,
        productName: "Smartwatch Alpha",
        version: "1.2",
        status: "Active",
        createdAt: "2024-02-01",
        lastUpdated: "2024-04-10",
        totalCost: 85.2,
      },
      {
        id: 3,
        productId: 103,
        productName: "Wireless Earbuds Pro",
        version: "2.0",
        status: "Draft",
        createdAt: "2024-05-10",
        lastUpdated: "2024-06-01",
        totalCost: 45.0,
      },
      {
        id: 4,
        productId: 101,
        productName: "Smartphone X v1.1",
        version: "1.1",
        status: "Archived",
        createdAt: "2024-03-01",
        lastUpdated: "2024-03-15",
        totalCost: 245.5,
      },
    ];

    const mockBomItems: BomItem[] = [
      {
        id: 101,
        bomId: 1,
        componentId: 1001,
        componentName: "Processor A",
        quantity: 1,
        unitOfMeasure: "unit",
        costPerUnit: 100,
      },
      {
        id: 102,
        bomId: 1,
        componentId: 1002,
        componentName: "Display Panel",
        quantity: 1,
        unitOfMeasure: "unit",
        costPerUnit: 50,
      },
      {
        id: 103,
        bomId: 1,
        componentId: 1003,
        componentName: "Battery Pack",
        quantity: 1,
        unitOfMeasure: "unit",
        costPerUnit: 20,
      },
      {
        id: 104,
        bomId: 2,
        componentId: 1004,
        componentName: "Microcontroller B",
        quantity: 1,
        unitOfMeasure: "unit",
        costPerUnit: 30,
      },
      {
        id: 105,
        bomId: 2,
        componentId: 1005,
        componentName: "OLED Screen",
        quantity: 1,
        unitOfMeasure: "unit",
        costPerUnit: 25,
      },
      {
        id: 106,
        bomId: 3,
        componentId: 1006,
        componentName: "Audio Chip C",
        quantity: 2,
        unitOfMeasure: "unit",
        costPerUnit: 10,
      },
      {
        id: 107,
        bomId: 3,
        componentId: 1007,
        componentName: "Plastic Casing",
        quantity: 1,
        unitOfMeasure: "unit",
        costPerUnit: 5,
      },
      {
        id: 108,
        bomId: 1,
        componentId: 1008,
        componentName: "Camera Module",
        quantity: 1,
        unitOfMeasure: "unit",
        costPerUnit: 40,
      },
    ];

    setTimeout(() => {
      setBoms(mockBoms);
      setBomItems(mockBomItems);
      setLoading(false);
    }, 500); // Simulate network delay
  }, []);

  // --- Helper Functions ---
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

  // --- Sorting Handlers ---
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

  // --- Filtering and Searching ---
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

  // --- Statistics ---
  const bomStats = {
    totalBoms: boms.length,
    activeBoms: boms.filter((b) => b.status === "Active").length,
    draftBoms: boms.filter((b) => b.status === "Draft").length,
    archivedBoms: boms.filter((b) => b.status === "Archived").length,
    totalComponents: bomItems.length,
    totalBOMValue: boms.reduce((sum, bom) => sum + (bom.totalCost || 0), 0),
  };

  // --- Chart Data ---
  const bomStatusData = [
    { name: "Active", value: bomStats.activeBoms },
    { name: "Draft", value: bomStats.draftBoms },
    { name: "Archived", value: bomStats.archivedBoms },
  ];

  // Group BOM items by component name for the bar chart
  const componentUsageData = bomItems.reduce((acc, item) => {
    const existing = acc.find((data) => data.name === item.componentName);
    if (existing) {
      existing.value += item.quantity; // Sum quantities for each component
    } else {
      acc.push({ name: item.componentName, value: item.quantity });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // --- Handlers for navigating to detail pages ---
  const handleBomClick = (id: number) => {
    // Navigate to a specific BOM detail page.
    // This could be /bom/{id} or /products/{productId}/bom/{id}
    router.push(`/bom/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96">
          <div className="text-red-500 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />

      {/* Main Content */}
      <div className="p-8 pt-20">
        {/* Header */}
        <div className="mb-8">
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
                onClick={() => router.push("/bom/new")} // Example for creating new BOM
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New BOM
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total BOMs</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {bomStats.totalBoms}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <Layers className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active BOMs</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {bomStats.activeBoms}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Draft BOMs</p>
                <p className="text-2xl font-semibold text-yellow-600 mt-1">
                  {bomStats.draftBoms}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
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
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search BOMs or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* BOMs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
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
                          <div className="h-8 w-8 bg-sky-100 rounded-full flex items-center justify-center mr-3">
                            <Layers className="h-4 w-4 text-sky-600" />
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
                            className="text-sky-600 hover:text-sky-800 transition-colors"
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
        <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
                  <Bar dataKey="value" name="Quantity" fill="#0ea5e9" />{" "}
                  {/* Sky-500 color */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent BOM Activity
          </h3>
          <div className="space-y-3">
            {/* Example recent activities - replace with actual data */}
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <Plus className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New BOM #3 for "Wireless Earbuds Pro" created (Draft)
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <Edit className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  BOM #1 for "Smartphone X v1.0" updated (added Camera Module)
                </p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <CheckCircle className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  BOM #2 for "Smartwatch Alpha" status changed to Active
                </p>
                <p className="text-xs text-gray-500 mt-1">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BomPage;
