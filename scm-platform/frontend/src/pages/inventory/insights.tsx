import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Package, // General inventory/items
  CheckCircle, // Completed/Accurate
  Hourglass, // In Progress/Pending
  TrendingUp, // Valuation/Growth
  ArrowRightLeft, // Movement/Transfer
  Filter,
  Search,
  Plus,
  Download,
  MoreVertical,
  Eye,
  Edit,
  XCircle, // Cancelled/Adjustment
  AlertCircle,
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

// --- Interfaces for Inventory Data ---

interface InventoryItemBasic {
  partNumber: string;
  description: string;
  unitCost: number;
}

interface CycleCountRecord {
  id: number;
  countId: string;
  countDate: string; // ISO 8601 string
  item: InventoryItemBasic;
  systemQuantity: number;
  countedQuantity: number;
  varianceUnits: number;
  variancePercentage: number; // e.g., 0.05 for 5%
  accuracyPercentage: number; // e.g., 0.95 for 95%
  status: "Planned" | "InProgress" | "Completed" | "Reviewed" | "Cancelled";
  countedBy: string;
  lastUpdated: string;
}

interface InventoryMovement {
  id: number;
  movementId: string;
  movementType: "Transfer" | "Adjustment" | "Receipt" | "Issue";
  item: InventoryItemBasic;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  movementDate: string; // ISO 8601 string
  recordedBy: string;
}

interface InventoryValuationSummary {
  totalInventoryValue: number;
  costOfGoodsOnHand: number;
  obsoleteInventoryValue: number;
  fastMovingInventoryValue: number;
  slowMovingInventoryValue: number;
  lastValuationDate: string;
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

const InventoryInsightsPage: React.FC = () => {
  const router = useRouter();
  const [cycleCounts, setCycleCounts] = useState<CycleCountRecord[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<
    InventoryMovement[]
  >([]);
  const [valuationSummary, setValuationSummary] =
    useState<InventoryValuationSummary | null>(null);

  const [cycleCountSearchTerm, setCycleCountSearchTerm] = useState<string>("");
  const [cycleCountStatusFilter, setCycleCountStatusFilter] =
    useState<string>("All");

  const [movementSearchTerm, setMovementSearchTerm] = useState<string>("");
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>("All");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Functions ---
  const fetchInventoryData = async () => {
    try {
      // Replace with your actual backend endpoints
      const [cycleCountsRes, movementsRes, valuationRes] = await Promise.all([
        fetch("/api/inventory/cycle-counts"),
        fetch("/api/inventory/movements"),
        fetch("/api/inventory/valuation-report"),
      ]);

      if (!cycleCountsRes.ok)
        throw new Error(
          `HTTP error! status: ${cycleCountsRes.status} for cycle counts`
        );
      if (!movementsRes.ok)
        throw new Error(
          `HTTP error! status: ${movementsRes.status} for movements`
        );
      if (!valuationRes.ok)
        throw new Error(
          `HTTP error! status: ${valuationRes.status} for valuation`
        );

      setCycleCounts(await cycleCountsRes.json());
      setInventoryMovements(await movementsRes.json());
      setValuationSummary(await valuationRes.json());
    } catch (err: any) {
      setError(`Failed to fetch inventory data: ${err.message}`);
      console.error("Error fetching inventory data:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await fetchInventoryData();
      setLoading(false);
    };
    loadData();
  }, []);

  // --- Mock Data for Demonstration (remove in production) ---
  useEffect(() => {
    const mockCycleCounts: CycleCountRecord[] = [
      {
        id: 1,
        countId: "CC-2025-001",
        countDate: "2025-06-03",
        item: {
          partNumber: "PN-A123",
          description: "Processor Unit",
          unitCost: 150.0,
        },
        systemQuantity: 100,
        countedQuantity: 98,
        varianceUnits: -2,
        variancePercentage: 0.02, // 2% variance
        accuracyPercentage: 0.98, // 98% accurate
        status: "Completed",
        countedBy: "Alice Johnson",
        lastUpdated: "2025-06-03",
      },
      {
        id: 2,
        countId: "CC-2025-002",
        countDate: "2025-06-05",
        item: {
          partNumber: "PN-B456",
          description: "Memory Module",
          unitCost: 75.0,
        },
        systemQuantity: 250,
        countedQuantity: 250,
        varianceUnits: 0,
        variancePercentage: 0,
        accuracyPercentage: 1, // 100% accurate
        status: "Reviewed",
        countedBy: "Bob Williams",
        lastUpdated: "2025-06-06",
      },
      {
        id: 3,
        countId: "CC-2025-003",
        countDate: "2025-06-07",
        item: {
          partNumber: "PN-C789",
          description: "Power Supply",
          unitCost: 40.0,
        },
        systemQuantity: 120,
        countedQuantity: 115,
        varianceUnits: -5,
        variancePercentage: 0.0417, // ~4.17% variance
        accuracyPercentage: 0.9583, // ~95.83% accurate
        status: "InProgress",
        countedBy: "Charlie Davis",
        lastUpdated: "2025-06-07",
      },
    ];

    const mockInventoryMovements: InventoryMovement[] = [
      {
        id: 1,
        movementId: "MOV-001",
        movementType: "Transfer",
        item: {
          partNumber: "PN-A123",
          description: "Processor Unit",
          unitCost: 150.0,
        },
        quantity: 10,
        fromLocation: "WH1-A-01",
        toLocation: "ASSEMBLY-LINE-2",
        movementDate: "2025-06-04T10:30:00",
        recordedBy: "Alice Johnson",
      },
      {
        id: 2,
        movementId: "MOV-002",
        movementType: "Receipt",
        item: {
          partNumber: "PN-B456",
          description: "Memory Module",
          unitCost: 75.0,
        },
        quantity: 200,
        fromLocation: "Supplier-XYZ",
        toLocation: "WH1-B-05",
        movementDate: "2025-06-05T14:00:00",
        recordedBy: "Bob Williams",
      },
      {
        id: 3,
        movementId: "MOV-003",
        movementType: "Adjustment",
        item: {
          partNumber: "PN-C789",
          description: "Power Supply",
          unitCost: 40.0,
        },
        quantity: -5, // Negative for reduction
        fromLocation: "WH1-C-10",
        toLocation: "WH1-C-10", // Same location for adjustment
        movementDate: "2025-06-06T09:15:00",
        recordedBy: "Charlie Davis",
      },
    ];

    const mockValuationSummary: InventoryValuationSummary = {
      totalInventoryValue: 1250000,
      costOfGoodsOnHand: 1100000,
      obsoleteInventoryValue: 50000,
      fastMovingInventoryValue: 800000,
      slowMovingInventoryValue: 200000,
      lastValuationDate: "2025-06-01",
    };

    setTimeout(() => {
      setCycleCounts(mockCycleCounts);
      setInventoryMovements(mockInventoryMovements);
      setValuationSummary(mockValuationSummary);
      setLoading(false);
    }, 500); // Simulate network delay
  }, []);

  // --- Helper Functions ---
  const getCycleCountStatusDisplay = (status: CycleCountRecord["status"]) => {
    switch (status) {
      case "Planned":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Hourglass className="h-3 w-3" />,
        };
      case "InProgress":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Hourglass className="h-3 w-3" />,
        };
      case "Completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "Reviewed":
        return {
          color: "bg-purple-100 text-purple-800",
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

  const getMovementTypeDisplay = (type: InventoryMovement["movementType"]) => {
    switch (type) {
      case "Transfer":
        return "bg-blue-100 text-blue-800";
      case "Adjustment":
        return type === "Adjustment" &&
          type === "Adjustment" &&
          (inventoryMovements.find((m) => m.movementType === type)?.quantity ||
            0) < 0
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800";
      case "Receipt":
        return "bg-green-100 text-green-800";
      case "Issue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // --- Filtering and Searching for Cycle Counts ---
  const filteredCycleCounts = cycleCounts.filter((cc) => {
    const matchesStatus =
      cycleCountStatusFilter === "All" || cc.status === cycleCountStatusFilter;
    const matchesSearch =
      cycleCountSearchTerm === "" ||
      cc.countId.toLowerCase().includes(cycleCountSearchTerm.toLowerCase()) ||
      cc.item.partNumber
        .toLowerCase()
        .includes(cycleCountSearchTerm.toLowerCase()) ||
      cc.item.description
        .toLowerCase()
        .includes(cycleCountSearchTerm.toLowerCase()) ||
      cc.countedBy.toLowerCase().includes(cycleCountSearchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // --- Filtering and Searching for Movements ---
  const filteredInventoryMovements = inventoryMovements.filter((mov) => {
    const matchesType =
      movementTypeFilter === "All" || mov.movementType === movementTypeFilter;
    const matchesSearch =
      movementSearchTerm === "" ||
      mov.movementId.toLowerCase().includes(movementSearchTerm.toLowerCase()) ||
      mov.item.partNumber
        .toLowerCase()
        .includes(movementSearchTerm.toLowerCase()) ||
      mov.item.description
        .toLowerCase()
        .includes(movementSearchTerm.toLowerCase()) ||
      mov.fromLocation
        .toLowerCase()
        .includes(movementSearchTerm.toLowerCase()) ||
      mov.toLocation.toLowerCase().includes(movementSearchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // --- Statistics ---
  const inventoryStats = {
    totalItemsTracked:
      cycleCounts.length +
      inventoryMovements.reduce(
        (sum, mov) => sum + (mov.movementType === "Receipt" ? 1 : 0),
        0
      ), // Simplistic, assumes unique items in CC and receipts
    openCycleCounts: cycleCounts.filter(
      (cc) => cc.status === "Planned" || cc.status === "InProgress"
    ).length,
    averageCycleCountAccuracy:
      cycleCounts.filter(
        (cc) => cc.status === "Completed" || cc.status === "Reviewed"
      ).length > 0
        ? (
            cycleCounts
              .filter(
                (cc) => cc.status === "Completed" || cc.status === "Reviewed"
              )
              .reduce((sum, cc) => sum + cc.accuracyPercentage, 0) /
            cycleCounts.filter(
              (cc) => cc.status === "Completed" || cc.status === "Reviewed"
            ).length
          ).toFixed(2)
        : "N/A",
    totalMovementsLast30Days: inventoryMovements.filter((mov) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(mov.movementDate) >= thirtyDaysAgo;
    }).length,
  };

  // --- Chart Data ---
  const cycleCountStatusData = Object.entries(
    cycleCounts.reduce((acc, cc) => {
      acc[cc.status] = (acc[cc.status] || 0) + 1;
      return acc;
    }, {} as Record<CycleCountRecord["status"], number>)
  ).map(([name, value]) => ({ name, value }));

  const movementTypeData = Object.entries(
    inventoryMovements.reduce((acc, mov) => {
      acc[mov.movementType] = (acc[mov.movementType] || 0) + 1;
      return acc;
    }, {} as Record<InventoryMovement["movementType"], number>)
  ).map(([name, value]) => ({ name, value }));

  const valuationBreakdownData = valuationSummary
    ? [
        {
          name: "Cost of Goods on Hand",
          value: valuationSummary.costOfGoodsOnHand,
        },
        {
          name: "Obsolete Inventory",
          value: valuationSummary.obsoleteInventoryValue,
        },
        // Add more categories if available
      ]
    : [];

  const accuracyTrendData = cycleCounts
    .filter((cc) => cc.status === "Completed" || cc.status === "Reviewed")
    .sort(
      (a, b) =>
        new Date(a.countDate).getTime() - new Date(b.countDate).getTime()
    )
    .map((cc) => ({
      date: new Date(cc.countDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      accuracy: Math.round(cc.accuracyPercentage * 100), // Convert to percentage integer
    }));

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
                Inventory Insights
              </h1>
              <p className="text-gray-600 mt-1">
                Gain deep insights into your inventory accuracy, movements, and
                valuation
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={() => router.push("/inventory/new-cycle-count")}
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Cycle Count
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Inventory Value
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {valuationSummary?.totalInventoryValue?.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    }
                  ) || "$0.00"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <TrendingUp className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Avg. Cycle Count Accuracy
                </p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {inventoryStats.averageCycleCountAccuracy !== "N/A"
                    ? `${inventoryStats.averageCycleCountAccuracy}%`
                    : "N/A"}
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
                <p className="text-sm font-medium text-gray-500">
                  Open Cycle Counts
                </p>
                <p className="text-2xl font-semibold text-yellow-600 mt-1">
                  {inventoryStats.openCycleCounts}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Hourglass className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Movements (Last 30 Days)
                </p>
                <p className="text-2xl font-semibold text-purple-600 mt-1">
                  {inventoryStats.totalMovementsLast30Days}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <ArrowRightLeft className="h-6 w-6 text-purple-600" />
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
                Record Adjustment
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Valuation Report
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="h-4 w-4 mr-2" />
                View Locations Map
              </button>
            </div>
          </div>
        </div>

        {/* Cycle Counting Overview Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-sky-600" /> Cycle Counting
              Overview
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cycle counts..."
                  value={cycleCountSearchTerm}
                  onChange={(e) => setCycleCountSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <select
                value={cycleCountStatusFilter}
                onChange={(e) => setCycleCountStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Planned">Planned</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    System Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Counted Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variance (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCycleCounts.map((cc) => {
                  const statusDisplay = getCycleCountStatusDisplay(cc.status);
                  return (
                    <tr
                      key={cc.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      // onClick={() => router.push(`/inventory/cycle-counts/${cc.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {cc.countId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(cc.countDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {cc.item.partNumber} - {cc.item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cc.systemQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cc.countedQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(cc.variancePercentage * 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(cc.accuracyPercentage * 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                        >
                          {statusDisplay.icon}
                          <span>{cc.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/inventory/cycle-counts/${cc.id}`);
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Cycle Count Accuracy Trend Chart */}
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            Accuracy Trend
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={accuracyTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[0, 100]}
                  label={{
                    value: "Accuracy (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#22d3ee"
                  activeDot={{ r: 8 }}
                  name="Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Movement & Shifting Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-2 text-sky-600" /> Inventory
              Movement & Shifting
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movements..."
                  value={movementSearchTerm}
                  onChange={(e) => setMovementSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <select
                value={movementTypeFilter}
                onChange={(e) => setMovementTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Transfer">Transfer</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Receipt">Receipt</option>
                <option value="Issue">Issue</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movement ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventoryMovements.map((mov) => (
                  <tr
                    key={mov.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    // onClick={() => router.push(`/inventory/movements/${mov.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {mov.movementId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementTypeDisplay(
                          mov.movementType
                        )}`}
                      >
                        {mov.movementType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {mov.item.partNumber} - {mov.item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mov.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mov.fromLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mov.toLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(mov.movementDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/inventory/movements/${mov.id}`);
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Movement Type Distribution Chart */}
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            Movement Type Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={movementTypeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#60a5fa" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Valuation & Health Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <TrendingUp className="h-5 w-5 mr-2 text-sky-600" /> Inventory
            Valuation & Health
          </h3>
          {valuationSummary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">
                  Cost of Goods On Hand
                </p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {valuationSummary.costOfGoodsOnHand.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">
                  Obsolete Inventory Value
                </p>
                <p className="text-xl font-semibold text-red-600 mt-1">
                  {valuationSummary.obsoleteInventoryValue.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    }
                  )}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">
                  Fast-Moving Inventory Value
                </p>
                <p className="text-xl font-semibold text-green-600 mt-1">
                  {valuationSummary.fastMovingInventoryValue.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    }
                  )}
                </p>
              </div>
              {/* Add more key metrics as needed */}
            </div>
          ) : (
            <p className="text-gray-500">No valuation data available.</p>
          )}

          {valuationSummary && valuationBreakdownData.length > 0 && (
            <>
              <h4 className="text-md font-semibold text-gray-800 mt-6 mb-3">
                Inventory Value Breakdown
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={valuationBreakdownData}
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
                      {valuationBreakdownData.map((entry, index) => (
                        <Cell
                          key={`cell-valuation-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        value.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Inventory Activity
          </h3>
          <div className="space-y-3">
            {/* Example recent activities - combine from all types */}
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <CheckCircle className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Cycle Count "CC-2025-002" for Memory Modules reviewed, 100%
                  accuracy.
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <ArrowRightLeft className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Inventory Adjustment "MOV-003": 5 Power Supplies reduced from
                  WH1-C-10.
                </p>
                <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <Plus className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New Cycle Count "CC-2025-003" initiated for Power Supplies.
                </p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InventoryInsightsPage;
