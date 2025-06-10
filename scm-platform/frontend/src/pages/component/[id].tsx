"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  Search,
  Bell,
  User,
  Menu,
  Home,
  Archive,
  FileText,
  Users as UsersIcon,
  Eye,
  CreditCard,
  Loader2, // For loading spinner
  ArrowUp, // For increase arrow
  ArrowDown, // For decrease arrow
} from "lucide-react"; // Using lucide-react for icons
import { motion } from "framer-motion"; // For animations

import Sidebar from "../../components/sidebar"; // Adjust path if needed
import Navbar from "../../components/navbar"; // Adjust path if needed
import Footer from "../../components/footer"; // Adjust path if needed
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast"; // Shadcn/ui toast system
import { useRouter, useParams } from "next/navigation"; // Updated import

// Import your custom/converted UI components (assuming shadcn/ui or similar)
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Example of a custom badge component

// API service functions
import {
  fetchMonthlyStockByComponent, // Modified to fetch by component
  fetchComponentDemandByComponent, // Modified to fetch by component
  fetchShippingInfo, // Keep if still needed for general overview
  fetchPurchaseOrders, // Keep if still needed for general overview
  fetchWarehouseInventoryByComponent, // Modified to fetch by component
  fetchComponent, // NEW: For fetching single component details
} from "../../services/api1"; // Adjust path if needed

// Types matching your backend
import {
  MonthlyStock as BackendMonthlyStock,
  ComponentDemand as BackendComponentDemand,
  ShippingInfo as BackendShippingInfo,
  PurchaseOrder as BackendPurchaseOrder,
  WarehouseInventory as BackendWarehouseInventory,
  Component as BackendComponent,
  Product as BackendProduct, // Keep if products use this component
  BOM as BackendBOM, // Keep if BOMs are part of component details
} from "../../../../backend/src/interfaces/index"; // Adjust path if needed

// Re-using the BlurredBackground component from your other pages
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

// UI data interfaces
interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeColor: string; // Tailwind class like 'text-blue-500'
  extra: string;
  isIncrease?: boolean; // Added for correct arrow display
}

interface InventoryData {
  month: string;
  quantity: number;
  usage: number;
}

interface UsageData {
  day: string;
  usage: number; // Represents movement
}

interface TrendData {
  month: string;
  forecast: number;
  actual: number;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  status: string;
  date: string;
}

export default function ComponentDetailDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [componentData, setComponentData] = useState<BackendComponent | null>(
    null
  );
  const [usedInProducts, setUsedInProducts] = useState<BackendProduct[]>([]); // Products that use this component
  const [relatedBOMs, setRelatedBOMs] = useState<BackendBOM[]>([]); // BOMs that include this component

  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const toast = useToast();

  const componentId = params?.id ? params.id.toString() : "";

  useEffect(() => {
    if (status === "loading") return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
      return; // Prevent further execution
    }
  }, [session, status, router]);

  // Load component-specific data from backend
  useEffect(() => {
    const loadComponentData = async () => {
      if (!componentId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch the specific component details
        const component = await fetchComponent(componentId);
        setComponentData(component);

        // Fetch component-specific data for charts and metrics
        const [
          monthlyStock,
          componentDemand,
          warehouseInventory,
          purchaseOrders,
        ] = await Promise.all([
          fetchMonthlyStockByComponent(componentId),
          fetchComponentDemandByComponent(componentId),
          fetchWarehouseInventoryByComponent(componentId),
          fetchPurchaseOrders(), // Fetch all purchase orders and filter later
        ]);

        // Find relevant warehouse inventory for this component
        const relevantWarehouseItem = warehouseInventory.find(
          (item) => item.componentId === component.id
        );

        const lowStockItems =
          relevantWarehouseItem &&
          relevantWarehouseItem.current_qty <
            (relevantWarehouseItem.component?.min_stock_level ?? 10)
            ? 1
            : 0;
        const outOfStockItems =
          relevantWarehouseItem && relevantWarehouseItem.current_qty <= 0
            ? 1
            : 0;

        setMetrics([
          {
            title: `Current Stock (${component.num})`,
            value: relevantWarehouseItem?.current_qty.toLocaleString() || "N/A",
            change: "—", // No change metric readily available
            changeColor: "text-gray-500",
            extra: "units available",
            isIncrease: true, // Neutral
          },
          {
            title: "Low Stock Alert",
            value: lowStockItems.toString(),
            change: lowStockItems > 0 ? "!" : "0%",
            changeColor:
              lowStockItems > 0 ? "text-orange-500" : "text-blue-500",
            extra: lowStockItems > 0 ? "needs attention" : "all good",
            isIncrease: lowStockItems > 0 ? false : true,
          },
          {
            title: "Out of Stock",
            value: outOfStockItems.toString(),
            change: outOfStockItems > 0 ? "!!" : "0%",
            changeColor: outOfStockItems > 0 ? "text-red-500" : "text-blue-500",
            extra: outOfStockItems > 0 ? "urgent reorder" : "in stock",
            isIncrease: outOfStockItems > 0 ? false : true,
          },
          {
            title: "Average Daily Usage",
            value: (
              componentDemand.reduce((sum, d) => sum + d.qty, 0) /
                componentDemand.length || 0
            ).toFixed(1),
            change: "—",
            changeColor: "text-gray-500",
            extra: "units/day (last 30 days)",
            isIncrease: true,
          },
        ]);

        // Process monthly stock data for inventory charts
        const processedInventoryData = monthlyStock.map(
          (stock: BackendMonthlyStock) => ({
            month: new Date(0, stock.month - 1).toLocaleString("default", {
              month: "short",
            }),
            quantity: stock.current_qty,
            usage: stock.qty_used || 0,
          })
        );
        setInventoryData(processedInventoryData);

        // Process purchase orders relevant to this component
        const processedPurchaseOrders = purchaseOrders
          .filter((po) =>
            po.poItems?.some((item) => item.componentId === component.id)
          ) // Filter by current component ID in PO items
          .slice(0, 3)
          .map((po: BackendPurchaseOrder) => ({
            id: `#${po.id.toString().padStart(3, "0")}`,
            supplier: po.supplier?.name || "Unknown Supplier",
            status: po.status === "Received" ? "Delivered" : po.status,
            date: new Date(po.date_created).toISOString().split("T")[0],
          }));
        setPurchaseOrders(processedPurchaseOrders);
      } catch (error) {
        console.error(
          `Failed to load data for component ${componentId}:`,
          error
        );
        toast({
          title: "Error",
          description: `Failed to load data for component ${componentId}.`,
          variant: "destructive",
        });
        setComponentData(null); // Clear component data on error
      } finally {
        setIsLoading(false);
      }
    };

    if (componentId && (session || localStorage.getItem("user"))) {
      loadComponentData();
    } else if (!componentId) {
      setIsLoading(false); // If no component ID, stop loading and potentially show a message
    }
  }, [componentId, session]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={true} />
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-700">
              Loading component data for ID: {componentId}...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!componentData && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={!!session || !!localStorage.getItem("user")} />
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg text-gray-700">
              Component with ID "{componentId}" not found or an error occurred.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isLoggedIn =
    !!session ||
    (typeof window !== "undefined" && !!localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Sidebar visible={sidebarOpen} setVisible={setSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-[180px]" : "ml-0"
        } relative z-10`}
      >
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="p-6 pt-20">
          {/* Component Header */}
          <div className="w-full bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {componentData?.num}
            </h1>
            <p className="text-gray-600 mb-4">
              Component ID:{" "}
              <span className="font-semibold">{componentData?.id}</span> | Type:{" "}
              <span className="font-semibold"></span>
            </p>
            <p className="text-gray-700">
              {componentData?.description || "No description available."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">SKU</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit of Measure</p>
                <p className="font-medium"></p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lead Time</p>
                <p className="font-medium">
                  {componentData?.lead_time_days
                    ? `${componentData.lead_time_days} days`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reorder Point</p>
                <p className="font-medium"></p>
              </div>
            </div>
          </div>

          {/* Metrics Cards - Now component-specific */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((item, i) => (
              <Card
                key={i}
                className="p-6 shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm"
              >
                <p className="text-sm text-gray-500 mb-1">{item.title}</p>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                  <div
                    className={`text-sm font-medium ${item.changeColor} bg-opacity-20 px-2 py-0.5 rounded-md flex items-center gap-1`}
                    style={{
                      backgroundColor: `${item.changeColor
                        .replace("text-", "")
                        .replace("-500", "")}-100`,
                    }}
                  >
                    {item.isIncrease ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {item.change}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {item.extra.startsWith("in") ? "Currently " : ""}
                  <span className="font-semibold text-gray-700">
                    {item.extra}
                  </span>
                </p>
              </Card>
            ))}
          </div>

          {/* Charts Row 1 - Now component-specific */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Inventory Trends for {componentData?.num}
                </h2>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <p className="text-gray-600">Quantity</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                    <p className="text-gray-600">Usage</p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      borderColor: "#e0e0e0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Quantity"
                  />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#93c5fd"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Usage"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Component Usage for {componentData?.num}
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      borderColor: "#e0e0e0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "white",
                    }}
                  />
                  <Bar
                    dataKey="usage"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Usage"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 2 - Now component-specific */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Purchase Orders for {componentData?.num}
              </h2>
              <Card className="p-4 rounded-md border border-gray-300 bg-white/80 shadow-sm backdrop-blur-sm overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.length > 0 ? (
                      purchaseOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell>
                            <Badge className="w-fit">{order.status}</Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>100</TableCell> {/* Example quantity */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-gray-500"
                        >
                          No recent purchase orders for this component.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Weekly Usage for {componentData?.num}
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      borderColor: "#e0e0e0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "white",
                    }}
                    labelStyle={{ color: "#4b5563" }}
                    itemStyle={{ color: "#1f2937" }}
                  />
                  <Bar
                    dataKey="usage"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Usage"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 3 - Now component-specific */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            <Card className="lg:col-span-2 p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Usage Forecast vs Actual for {componentData?.num}
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  {trendData
                    .reduce((sum, item) => sum + item.actual, 0)
                    .toLocaleString()}{" "}
                  units
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      borderColor: "#e0e0e0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "white",
                    }}
                    labelStyle={{ color: "#4b5563" }}
                    itemStyle={{ color: "#1f2937" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.2}
                    name="Actual Usage"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="#82ca9d"
                    fill="#82ca94"
                    fillOpacity={0.2}
                    name="Forecast"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Inventory Levels for {componentData?.num}
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-600"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      borderColor: "#e0e0e0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "white",
                    }}
                    labelStyle={{ color: "#4b5563" }}
                    itemStyle={{ color: "#1f2937" }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    name="Quantity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Additional Component Information */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Used In Products
              </h2>
              <div className="space-y-4">
                {usedInProducts.length > 0 ? (
                  usedInProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border-b border-gray-100"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <Badge variant="outline">Used in {product.name}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    This component is not used in any products.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Supplier Information
              </h2>
              {componentData?.supplier ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Supplier:</p>
                    <p className="font-medium"></p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Lead Time:</p>
                    <p className="font-medium">
                      {componentData.lead_time_days} days
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Last Price:</p>
                    <p className="font-medium">
                      ${componentData.last_purchase_price?.toFixed(2) || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">MOQ:</p>
                    <p className="font-medium">
                      {componentData.min_order_quantity || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No preferred supplier set for this component.
                </p>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
