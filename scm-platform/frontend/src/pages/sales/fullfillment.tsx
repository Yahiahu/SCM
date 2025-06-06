import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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
  Truck, // For ShippingInfo
  RefreshCcw, // For Return Orders
  Tag, // For return reasons
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

// Assuming these interfaces exist or can be defined based on your backend schema
interface ReturnOrder {
  id: number;
  purchaseOrderId: number;
  reason: string;
  createdAt: string;
  // Add more fields as needed, e.g., status, items
}

interface ShippingInfo {
  id: number;
  poId: number;
  componentId: number;
  qty: number;
  origin: string;
  destination: string;
  carrier: string;
  tracking_number: string;
  estimated_arrival: string;
  status: string;
  // Add componentName if needed for display
}

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Fulfillment: React.FC = () => {
  const router = useRouter();
  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>([]);
  const [shippingInfos, setShippingInfos] = useState<ShippingInfo[]>([]);
  const [activeTab, setActiveTab] = useState<"shipments" | "returns">(
    "shipments"
  ); // New state for tabs
  const [shipmentStatusFilter, setShipmentStatusFilter] =
    useState<string>("All");
  const [returnReasonFilter, setReturnReasonFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortFieldShipment, setSortFieldShipment] =
    useState<keyof ShippingInfo>("id");
  const [sortOrderShipment, setSortOrderShipment] = useState<"asc" | "desc">(
    "desc"
  );
  const [sortFieldReturn, setSortFieldReturn] =
    useState<keyof ReturnOrder>("id");
  const [sortOrderReturn, setSortOrderReturn] = useState<"asc" | "desc">(
    "desc"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Functions ---
  const fetchReturnOrders = async () => {
    try {
      const response = await fetch("/api/returnorders"); // Your backend endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReturnOrders(data);
    } catch (err: any) {
      setError(`Failed to fetch return orders: ${err.message}`);
      console.error("Error fetching return orders:", err);
    }
  };

  const fetchShippingInfos = async () => {
    try {
      const response = await fetch("/api/shippinginfo"); // Your backend endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // To get component names for shipping info, you might need another fetch or join data.
      // For now, let's assume `componentName` might be added later or handled on backend.
      setShippingInfos(data);
    } catch (err: any) {
      setError(`Failed to fetch shipping information: ${err.message}`);
      console.error("Error fetching shipping information:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchReturnOrders(), fetchShippingInfos()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // --- Helper Functions ---
  const getShipmentStatusDisplay = (status: string) => {
    switch (status) {
      case "In Transit":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Truck className="h-3 w-3" />,
        };
      case "Delivered":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "Processing":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-3 w-3" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  const getReturnReasonDisplay = (reason: string) => {
    switch (reason) {
      case "Defective capacitors":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case "Incorrect quantity received":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Tag className="h-3 w-3" />,
        };
      case "Damaged during transit":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case "Changed order requirements":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <RefreshCcw className="h-3 w-3" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Tag className="h-3 w-3" />,
        };
    }
  };

  // --- Sorting Handlers ---
  const handleSortShipment = (field: keyof ShippingInfo) => {
    const newSortOrder =
      sortFieldShipment === field && sortOrderShipment === "asc"
        ? "desc"
        : "asc";
    setSortFieldShipment(field);
    setSortOrderShipment(newSortOrder);

    const sortedData = [...shippingInfos].sort((a, b) => {
      const aValue = a[field] as any; // Cast to any for comparison
      const bValue = b[field] as any;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return newSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return newSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    setShippingInfos(sortedData);
  };

  const handleSortReturn = (field: keyof ReturnOrder) => {
    const newSortOrder =
      sortFieldReturn === field && sortOrderReturn === "asc" ? "desc" : "asc";
    setSortFieldReturn(field);
    setSortOrderReturn(newSortOrder);

    const sortedData = [...returnOrders].sort((a, b) => {
      const aValue = a[field] as any;
      const bValue = b[field] as any;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return newSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return newSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    setReturnOrders(sortedData);
  };

  // --- Filtering and Searching ---
  const filteredShippingInfos = shippingInfos.filter((info) => {
    const matchesStatus =
      shipmentStatusFilter === "All" || info.status === shipmentStatusFilter;
    const matchesSearch =
      searchTerm === "" ||
      info.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredReturnOrders = returnOrders.filter((order) => {
    const matchesReason =
      returnReasonFilter === "All" || order.reason === returnReasonFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    return matchesReason && matchesSearch;
  });

  // --- Statistics ---
  const shipmentStats = {
    total: shippingInfos.length,
    inTransit: shippingInfos.filter((s) => s.status === "In Transit").length,
    delivered: shippingInfos.filter((s) => s.status === "Delivered").length,
    processing: shippingInfos.filter((s) => s.status === "Processing").length,
  };

  const returnStats = {
    total: returnOrders.length,
    defective: returnOrders.filter((r) => r.reason === "Defective capacitors")
      .length,
    incorrectQty: returnOrders.filter(
      (r) => r.reason === "Incorrect quantity received"
    ).length,
    damaged: returnOrders.filter((r) => r.reason === "Damaged during transit")
      .length,
    changedRequirements: returnOrders.filter(
      (r) => r.reason === "Changed order requirements"
    ).length,
  };

  // --- Chart Data ---
  const shipmentStatusData = [
    { name: "In Transit", value: shipmentStats.inTransit },
    { name: "Delivered", value: shipmentStats.delivered },
    { name: "Processing", value: shipmentStats.processing },
  ];

  const returnReasonData = [
    { name: "Defective", value: returnStats.defective },
    { name: "Incorrect Qty", value: returnStats.incorrectQty },
    { name: "Damaged", value: returnStats.damaged },
    { name: "Changed Req.", value: returnStats.changedRequirements },
  ];

  // --- Handlers for navigating to detail pages (if applicable) ---
  const handleShippingInfoClick = (id: number) => {
    router.push(`/fulfillment/shipments/${id}`);
  };

  const handleReturnOrderClick = (id: number) => {
    router.push(`/fulfillment/returns/${id}`);
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
              <h1 className="text-3xl font-bold text-gray-900">Fulfillment</h1>
              <p className="text-gray-600 mt-1">
                Manage and track all shipments and returns
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                New Shipment/Return
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
                  Total Shipments
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {shipmentStats.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <Package className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <p className="text-2xl font-semibold text-blue-600 mt-1">
                  {shipmentStats.inTransit}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {shipmentStats.delivered}
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
                  Total Returns
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {returnStats.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <RefreshCcw className="h-6 w-6 text-sky-600" />
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
                Create New Shipment
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Initiate Return
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download Reports
              </button>
            </div>
          </div>
        </div>

        {/* Tabs for Shipments and Returns */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "shipments"
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("shipments")}
          >
            Shipments
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "returns"
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("returns")}
          >
            Return Orders
          </button>
        </div>

        {/* Search and Filters for active tab */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${
                activeTab === "shipments" ? "shipments" : "returns"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            {activeTab === "shipments" ? (
              <select
                value={shipmentStatusFilter}
                onChange={(e) => setShipmentStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            ) : (
              <select
                value={returnReasonFilter}
                onChange={(e) => setReturnReasonFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="All">All Reasons</option>
                <option value="Defective capacitors">Defective</option>
                <option value="Incorrect quantity received">
                  Incorrect Quantity
                </option>
                <option value="Damaged during transit">Damaged</option>
                <option value="Changed order requirements">
                  Changed Requirements
                </option>
                {/* Add more return reasons as needed */}
              </select>
            )}
          </div>
        </div>

        {/* Table for active tab */}
        {activeTab === "shipments" ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortShipment("id")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Shipment ID</span>
                        {sortFieldShipment === "id" && (
                          <span>{sortOrderShipment === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortShipment("tracking_number")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Tracking #</span>
                        {sortFieldShipment === "tracking_number" && (
                          <span>{sortOrderShipment === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Arrival
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShippingInfos.map((info) => {
                    const statusDisplay = getShipmentStatusDisplay(info.status);
                    return (
                      <tr
                        key={info.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleShippingInfoClick(info.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{info.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {info.tracking_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {info.carrier}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {info.origin}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {info.destination}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.icon}
                            <span>{info.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            info.estimated_arrival
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShippingInfoClick(info.id);
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
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortReturn("id")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Return ID</span>
                        {sortFieldReturn === "id" && (
                          <span>{sortOrderReturn === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortReturn("purchaseOrderId")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>PO ID</span>
                        {sortFieldReturn === "purchaseOrderId" && (
                          <span>{sortOrderReturn === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortReturn("createdAt")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Created At</span>
                        {sortFieldReturn === "createdAt" && (
                          <span>{sortOrderReturn === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReturnOrders.map((order) => {
                    const reasonDisplay = getReturnReasonDisplay(order.reason);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleReturnOrderClick(order.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            #{order.purchaseOrderId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${reasonDisplay.color}`}
                          >
                            {reasonDisplay.icon}
                            <span>{order.reason}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReturnOrderClick(order.id);
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
        )}

        {/* Summary Footer */}
        <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
          <div>
            {activeTab === "shipments"
              ? `Showing ${filteredShippingInfos.length} of ${shippingInfos.length} shipments`
              : `Showing ${filteredReturnOrders.length} of ${returnOrders.length} return orders`}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Shipment Status Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shipment Status Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shipmentStatusData}
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
                    {shipmentStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-shipment-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Return Reason Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Return Reasons Breakdown
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={returnReasonData}
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
                    formatter={(value) => [value, "Number of Returns"]}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Returns" fill="#a855f7" />{" "}
                  {/* Sky-50 inspired color */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Fulfillment Activity
          </h3>
          <div className="space-y-3">
            {/* Example recent activities - replace with actual data */}
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <Truck className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Shipment #DHL12345ABC status updated to 'Delivered'
                </p>
                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <RefreshCcw className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New return order #2 created for defective items
                </p>
                <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-sky-50 rounded-lg">
              <div className="bg-sky-100 p-2 rounded-full mr-3">
                <Calendar className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Shipment #UPS112233DEF expected arrival today
                </p>
                <p className="text-xs text-gray-500 mt-1">Today, 8:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Fulfillment;
