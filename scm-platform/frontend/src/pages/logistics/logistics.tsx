"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/components/ui/use-toast";
import {
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Hourglass,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
} from "recharts";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

interface Shipment {
  id: number;
  shipmentNumber: string;
  origin?: string;
  destination?: string;
  expectedDate: string;
  actualDate: string | null;
  status:
    | "Scheduled"
    | "InTransit"
    | "Delayed"
    | "Delivered"
    | "Received"
    | "Cancelled";
  carrier: string;
  itemsCount: number;
  lastUpdated: string;
  type: "Inbound" | "Outbound";
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

const LogisticsPage: React.FC = () => {
  const router = useRouter();
  const toast  = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [inboundStatusFilter, setInboundStatusFilter] = useState<string>("All");
  const [outboundStatusFilter, setOutboundStatusFilter] =
    useState<string>("All");
  const [inboundSearchTerm, setInboundSearchTerm] = useState<string>("");
  const [outboundSearchTerm, setOutboundSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all shipments from shipping info endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shippinginfo`);
      if (!response.ok) throw new Error("Failed to fetch shipments");
      const data = await response.json();

      // Transform data to our Shipment interface
      const transformedShipments = data.map((shipment: any) => ({
        id: shipment.id,
        shipmentNumber: shipment.shipmentNumber,
        origin: shipment.origin,
        destination: shipment.destination,
        expectedDate: shipment.expectedDate,
        actualDate: shipment.actualDate,
        status: shipment.status,
        carrier: shipment.carrier,
        itemsCount: shipment.itemsCount,
        lastUpdated: shipment.lastUpdated,
        type: shipment.type, // Assuming the API returns 'Inbound' or 'Outbound'
      }));

      setShipments(transformedShipments);
    } catch (err: any) {
      setError(`Failed to fetch shipments: ${err.message}`);
      toast({
        title: "Error",
        description: `Failed to fetch shipments: ${err.message}`,
        variant: "destructive",
      });
      console.error("Error fetching shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getInboundStatusDisplay = (status: Shipment["status"]) => {
    switch (status) {
      case "Scheduled":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Hourglass className="h-3 w-3" />,
        };
      case "InTransit":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Truck className="h-3 w-3" />,
        };
      case "Delayed":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case "Received":
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

  const getOutboundStatusDisplay = (status: Shipment["status"]) => {
    switch (status) {
      case "Scheduled":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Hourglass className="h-3 w-3" />,
        };
      case "InTransit":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <Truck className="h-3 w-3" />,
        };
      case "Delayed":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case "Delivered":
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

  const inboundShipments = shipments.filter((s) => s.type === "Inbound");
  const outboundShipments = shipments.filter((s) => s.type === "Outbound");

  const filteredInboundShipments = inboundShipments.filter((shipment) => {
    const matchesStatus =
      inboundStatusFilter === "All" || shipment.status === inboundStatusFilter;
    const matchesSearch =
      inboundSearchTerm === "" ||
      shipment.shipmentNumber
        .toLowerCase()
        .includes(inboundSearchTerm.toLowerCase()) ||
      (shipment.origin &&
        shipment.origin
          .toLowerCase()
          .includes(inboundSearchTerm.toLowerCase())) ||
      shipment.carrier.toLowerCase().includes(inboundSearchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredOutboundShipments = outboundShipments.filter((shipment) => {
    const matchesStatus =
      outboundStatusFilter === "All" ||
      shipment.status === outboundStatusFilter;
    const matchesSearch =
      outboundSearchTerm === "" ||
      shipment.shipmentNumber
        .toLowerCase()
        .includes(outboundSearchTerm.toLowerCase()) ||
      (shipment.destination &&
        shipment.destination
          .toLowerCase()
          .includes(outboundSearchTerm.toLowerCase())) ||
      shipment.carrier.toLowerCase().includes(outboundSearchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const logisticsStats = {
    totalInbound: inboundShipments.length,
    inTransitInbound: inboundShipments.filter((s) => s.status === "InTransit")
      .length,
    receivedInbound: inboundShipments.filter((s) => s.status === "Received")
      .length,
    totalOutbound: outboundShipments.length,
    dispatchedOutbound: outboundShipments.filter(
      (s) => s.status === "InTransit" || s.status === "Delivered"
    ).length,
    deliveredOutbound: outboundShipments.filter((s) => s.status === "Delivered")
      .length,
    totalActiveShipments:
      inboundShipments.filter(
        (s) =>
          s.status === "InTransit" ||
          s.status === "Scheduled" ||
          s.status === "Delayed"
      ).length +
      outboundShipments.filter(
        (s) =>
          s.status === "InTransit" ||
          s.status === "Scheduled" ||
          s.status === "Delayed"
      ).length,
  };

  const inboundStatusData = Object.entries(
    inboundShipments.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<Shipment["status"], number>)
  ).map(([name, value]) => ({ name, value }));

  const outboundStatusData = Object.entries(
    outboundShipments.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<Shipment["status"], number>)
  ).map(([name, value]) => ({ name, value }));

  const handleInboundClick = (id: number) => {
    router.push(`/logistics/inbound/${id}`);
  };

  const handleOutboundClick = (id: number) => {
    router.push(`/logistics/outbound/${id}`);
  };

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Logistics Overview
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor and manage all inbound and outbound shipments
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={fetchShipments}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Refresh Data
                </button>
                <button
                  onClick={() => router.push("/logistics/new-outbound")}
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Outbound
                </button>
                <button
                  onClick={() => router.push("/logistics/new-inbound")}
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Inbound
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Active Shipments */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Active Shipments
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {logisticsStats.totalActiveShipments}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-sky-50">
                  <Truck className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </div>

            {/* Inbound In Transit */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Inbound In Transit
                  </p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">
                    {logisticsStats.inTransitInbound}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <ArrowDownToLine className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Outbound Dispatched */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Outbound Dispatched
                  </p>
                  <p className="text-2xl font-semibold text-purple-600 mt-1">
                    {logisticsStats.dispatchedOutbound}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <ArrowUpFromLine className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Today's Deliveries */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Today's Deliveries
                  </p>
                  <p className="text-2xl font-semibold text-green-600 mt-1">
                    {
                      outboundShipments.filter(
                        (s) =>
                          s.actualDate ===
                            new Date().toISOString().split("T")[0] &&
                          s.status === "Delivered"
                      ).length
                    }{" "}
                    Out |{" "}
                    {
                      inboundShipments.filter(
                        (s) =>
                          s.actualDate ===
                            new Date().toISOString().split("T")[0] &&
                          s.status === "Received"
                      ).length
                    }{" "}
                    In
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Inbound Shipments Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ArrowDownToLine className="h-5 w-5 mr-2 text-sky-600" />{" "}
                Inbound Shipments
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inbound..."
                    value={inboundSearchTerm}
                    onChange={(e) => setInboundSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  />
                </div>
                <select
                  value={inboundStatusFilter}
                  onChange={(e) => setInboundStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="InTransit">In Transit</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Received">Received</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipment #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exp. Arrival
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Act. Arrival
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {filteredInboundShipments.map((shipment) => {
                    const statusDisplay = getInboundStatusDisplay(
                      shipment.status
                    );
                    return (
                      <tr
                        key={shipment.id}
                        className="hover:bg-gray-50/70 cursor-pointer transition-colors"
                        onClick={() => handleInboundClick(shipment.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {shipment.shipmentNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {shipment.origin || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(shipment.expectedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shipment.actualDate
                            ? new Date(shipment.actualDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.icon}
                            <span>{shipment.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shipment.carrier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shipment.itemsCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInboundClick(shipment.id);
                              }}
                              className="text-sky-600 hover:text-sky-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Total Inbound Shipments: {logisticsStats.totalInbound}
            </div>
          </div>

          {/* Outbound Shipments Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ArrowUpFromLine className="h-5 w-5 mr-2 text-sky-600" />{" "}
                Outbound Shipments
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search outbound..."
                    value={outboundSearchTerm}
                    onChange={(e) => setOutboundSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  />
                </div>
                <select
                  value={outboundStatusFilter}
                  onChange={(e) => setOutboundStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="InTransit">In Transit</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipment #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dispatch Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {filteredOutboundShipments.map((shipment) => {
                    const statusDisplay = getOutboundStatusDisplay(
                      shipment.status
                    );
                    return (
                      <tr
                        key={shipment.id}
                        className="hover:bg-gray-50/70 cursor-pointer transition-colors"
                        onClick={() => handleOutboundClick(shipment.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {shipment.shipmentNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {shipment.destination || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(shipment.expectedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shipment.actualDate
                            ? new Date(shipment.actualDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.icon}
                            <span>{shipment.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shipment.carrier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shipment.itemsCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOutboundClick(shipment.id);
                              }}
                              className="text-sky-600 hover:text-sky-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Total Outbound Shipments: {logisticsStats.totalOutbound}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Inbound Status Distribution Pie Chart */}
            {inboundStatusData.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Inbound Shipment Status
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inboundStatusData}
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
                        {inboundStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-inbound-status-${index}`}
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
            )}

            {/* Outbound Status Distribution Pie Chart */}
            {outboundStatusData.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Outbound Shipment Status
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={outboundStatusData}
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
                        {outboundStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-outbound-status-${index}`}
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
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Logistics Activity
            </h3>
            <div className="space-y-3">
              {inboundShipments.slice(0, 1).map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-start p-3 bg-sky-50/70 rounded-lg"
                >
                  <div className="bg-sky-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-4 w-4 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Inbound Shipment "{shipment.shipmentNumber}" -{" "}
                      {shipment.status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(shipment.expectedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {outboundShipments.slice(0, 1).map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-start p-3 bg-sky-50/70 rounded-lg"
                >
                  <div className="bg-sky-100 p-2 rounded-full mr-3">
                    <Truck className="h-4 w-4 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Outbound Shipment "{shipment.shipmentNumber}" -{" "}
                      {shipment.status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(shipment.expectedDate).toLocaleDateString()}
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

export default LogisticsPage;
