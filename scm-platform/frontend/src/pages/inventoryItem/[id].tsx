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
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useParams } from "next/navigation";

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
import { Badge } from "@/components/ui/badge";

import {
  fetchMonthlyStockByComponent,
  fetchComponentDemandByComponent,
  fetchShippingInfo,
  fetchPurchaseOrders,
  fetchWarehouseInventoryByComponent,
  fetchComponent,
  fetchWarehouseInventory,
} from "../../services/api1";

import {
  MonthlyStock as BackendMonthlyStock,
  ComponentDemand as BackendComponentDemand,
  ShippingInfo as BackendShippingInfo,
  PurchaseOrder as BackendPurchaseOrder,
  WarehouseInventory as BackendWarehouseInventory,
  Component as BackendComponent,
  Product as BackendProduct,
  BOM as BackendBOM,
} from "../../../../backend/src/interfaces/index";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  extra: string;
  isIncrease?: boolean;
}

interface InventoryData {
  month: string;
  quantity: number;
  usage: number;
}

interface UsageData {
  day: string;
  usage: number;
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
  quantity: number;
}

interface WarehouseInventory {
  id: number;
  warehouseName: string;
  currentQty: number;
  minStockLevel: number;
}

export default function ComponentDetailDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [warehouseInventory, setWarehouseInventory] = useState<
    WarehouseInventory[]
  >([]);

  const [componentData, setComponentData] = useState<BackendComponent | null>(
    null
  );
  const [usedInProducts, setUsedInProducts] = useState<BackendProduct[]>([]);
  const [relatedBOMs, setRelatedBOMs] = useState<BackendBOM[]>([]);

  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const  toast  = useToast();

  const componentId = params?.id ? params.id.toString() : "";

  useEffect(() => {
    if (status === "loading") return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const loadComponentData = async () => {
      if (!componentId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch all necessary data
        const [
          component,
          monthlyStock,
          componentDemand,
          warehouseInventory,
          purchaseOrders,
          allWarehouseInventory,
        ] = await Promise.all([
          fetchComponent(componentId),
          fetchMonthlyStockByComponent(componentId),
          fetchComponentDemandByComponent(componentId),
          fetchWarehouseInventoryByComponent(componentId),
          fetchPurchaseOrders(),
          fetchWarehouseInventory(),
        ]);
        setComponentData(component);

        // Process warehouse inventory data
        const relevantWarehouseItems = allWarehouseInventory
          .filter((item) => item.componentId === parseInt(componentId))
          .map((item) => ({
            id: item.id,
            warehouseName: item.warehouse?.name || "Unknown",
            currentQty: item.current_qty,
            minStockLevel: item.component?.min_stock_level || 0,
          }));

        setWarehouseInventory(relevantWarehouseItems);

        // Find primary warehouse item for metrics
        const primaryWarehouseItem = relevantWarehouseItems[0] || {
          currentQty: 0,
          minStockLevel: 0,
        };

        const lowStockItems =
          primaryWarehouseItem.currentQty < primaryWarehouseItem.minStockLevel
            ? 1
            : 0;
        const outOfStockItems = primaryWarehouseItem.currentQty <= 0 ? 1 : 0;

        setMetrics([
          {
            title: `Current Stock (${component.num})`,
            value: primaryWarehouseItem.currentQty.toLocaleString(),
            change: "—",
            changeColor: "text-gray-500",
            extra: "units available",
            isIncrease: true,
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

        // Process monthly stock data
        const processedInventoryData = monthlyStock.map((stock) => ({
          month: new Date(0, stock.month - 1).toLocaleString("default", {
            month: "short",
          }),
          quantity: stock.current_qty,
          usage: stock.qty_used || 0,
        }));
        setInventoryData(processedInventoryData);

        // Generate weekly usage data (mock data if not available)
        const mockUsageData = Array.from({ length: 7 }, (_, i) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          usage: Math.floor(Math.random() * 20) + 5,
        }));
        setUsageData(mockUsageData);

        // Generate trend data (mock data if not available)
        const mockTrendData = Array.from({ length: 6 }, (_, i) => ({
          month: new Date(0, i).toLocaleString("default", { month: "short" }),
          forecast: Math.floor(Math.random() * 100) + 50,
          actual: Math.floor(Math.random() * 100) + 40,
        }));
        setTrendData(mockTrendData);

        // Process purchase orders
        const processedPurchaseOrders = purchaseOrders
          .filter((po) =>
            po.poItems?.some(
              (item) => item.componentId === parseInt(componentId)
            )
          )
          .slice(0, 3)
          .map((po) => ({
            id: `#${po.id.toString().padStart(3, "0")}`,
            supplier: po.supplier?.name || "Unknown Supplier",
            status: po.status === "Received" ? "Delivered" : po.status,
            date: new Date(po.date_created).toISOString().split("T")[0],
            quantity:
              po.poItems?.find(
                (item) => item.componentId === parseInt(componentId)
              )?.ordered_qty || 0,
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
        setComponentData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (componentId && (session || localStorage.getItem("user"))) {
      loadComponentData();
    } else if (!componentId) {
      setIsLoading(false);
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
            <Button onClick={() => router.push("/inventory")}>
              Back to Inventory
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
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {componentData?.num}
                </h1>
                <p className="text-gray-600 mb-4">
                  Component ID:{" "}
                  <span className="font-semibold">{componentData?.id}</span>
                </p>
                <p className="text-gray-700">
                  {componentData?.description || "No description available."}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/inventory")}
              >
                Back to Inventory
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">SKU</p>
                <p className="font-medium">{componentData?.sku || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit of Measure</p>
                <p className="font-medium">
                </p>
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
                <p className="font-medium">
                  {componentData?.min_stock_level || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
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

          {/* Charts Row 1 */}
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

          {/* Warehouse Inventory Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Warehouse Inventory for {componentData?.num}
            </h2>
            <Card className="p-4 rounded-md border border-gray-300 bg-white/80 shadow-sm backdrop-blur-sm overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Current Quantity</TableHead>
                    <TableHead>Minimum Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouseInventory.length > 0 ? (
                    warehouseInventory.map((item) => {
                      const status =
                        item.currentQty <= 0
                          ? "Out of Stock"
                          : item.currentQty < item.minStockLevel
                          ? "Low Stock"
                          : "In Stock";

                      const statusClasses =
                        status === "In Stock"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : status === "Low Stock"
                          ? "text-amber-700 bg-amber-50 border-amber-200"
                          : "text-red-700 bg-red-50 border-red-200";

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.warehouseName}
                          </TableCell>
                          <TableCell>
                            {item.currentQty.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {item.minStockLevel.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusClasses} w-fit`}>
                              {status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        No inventory found in any warehouse for this component.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Purchase Orders Table */}
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
                          <TableCell>{order.quantity}</TableCell>
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

          {/* Supplier and Product Usage Info */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Supplier Information
              </h2>
              {componentData?.supplier ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Supplier:</p>
                    <p className="font-medium">{componentData.supplier.name}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Contact:</p>
                    <p className="font-medium">
                      {componentData.supplier.contact_email || "N/A"}
                    </p>
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
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
