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

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast"; // Shadcn/ui toast system
import { useRouter } from "next/navigation";

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
  fetchMonthlyStock,
  fetchProductDemand,
  fetchShippingInfo,
  fetchPurchaseOrders,
  fetchWarehouseInventory,
  fetchComponents,
  fetchProducts,
  fetchBOMs,
} from "../services/api";

// Types matching your backend
import {
  MonthlyStock as BackendMonthlyStock,
  ProductDemand as BackendProductDemand,
  ShippingInfo as BackendShippingInfo,
  PurchaseOrder as BackendPurchaseOrder,
  WarehouseInventory as BackendWarehouseInventory,
  Component as BackendComponent,
  Product as BackendProduct,
  BOM as BackendBOM,
} from "../../../backend/src/interfaces/index";

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

interface SalesData {
  month: string;
  revenue: number;
  cost: number;
}

interface SupportData {
  day: string;
  tickets: number; // Represents movement
}

interface TrendData {
  month: string;
  forecast: number;
  actual: number;
}

interface ShippingOrder {
  id: string;
  customer: string;
  status: string;
  date: string;
}

export default function ModernInventoryDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true); // Keep for sidebar state
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [supportData, setSupportData] = useState<SupportData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([]);
  const [components, setComponents] = useState<BackendComponent[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [boms, setBoms] = useState<BackendBOM[]>([]);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const toast  = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "loading" || !isClient) return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [session, status, isClient, router]);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch all necessary data
        const [
          monthlyStock,
          productDemand,
          shippingInfo, // Still fetching if needed elsewhere, but not used in this display
          purchaseOrders,
          warehouseInventory,
          allComponents,
          allProducts,
          allBoms,
        ] = await Promise.all([
          fetchMonthlyStock(),
          fetchProductDemand(),
          fetchShippingInfo(),
          fetchPurchaseOrders(),
          fetchWarehouseInventory(),
          fetchComponents(),
          fetchProducts(),
          fetchBOMs(),
        ]);

        setComponents(allComponents);
        setProducts(allProducts);
        setBoms(allBoms);

        // Calculate inventory metrics
        const totalComponents = allComponents.length;
        const totalProducts = allProducts.length;
        // Ensure min_stock_level is correctly handled (backend type definition might be needed)
        const lowStockItems = warehouseInventory.filter(
          (item: BackendWarehouseInventory) =>
            item.current_qty < (item.component?.min_stock_level ?? 10) // Assuming default min_stock_level if undefined
        ).length;
        const outOfStockItems = warehouseInventory.filter(
          (item: BackendWarehouseInventory) => item.current_qty <= 0
        ).length;

        // Process data for dashboard metrics
        setMetrics([
          {
            title: "Total Components",
            value: totalComponents.toLocaleString(),
            change: "8.5%",
            changeColor: "text-blue-500",
            extra: "in inventory",
            isIncrease: true,
          },
          {
            title: "Total Products",
            value: totalProducts.toLocaleString(),
            change: "12.2%",
            changeColor: "text-blue-500",
            extra: "in catalog",
            isIncrease: true,
          },
          {
            title: "Low Stock Items",
            value: lowStockItems.toString(),
            change: lowStockItems > 0 ? "5.7%" : "0%",
            changeColor:
              lowStockItems > 0 ? "text-orange-500" : "text-blue-500",
            extra: "needs attention",
            isIncrease: lowStockItems > 0 ? false : true, // If low stock increases, it's bad
          },
          {
            title: "Out of Stock",
            value: outOfStockItems.toString(),
            change: outOfStockItems > 0 ? "3.4%" : "0%",
            changeColor: outOfStockItems > 0 ? "text-red-500" : "text-blue-500",
            extra: "urgent reorder",
            isIncrease: outOfStockItems > 0 ? false : true, // If out of stock increases, it's bad
          },
        ]);

        // Process monthly stock data for sales charts (Inventory Utilization)
        const processedSalesData = monthlyStock.map(
          (stock: BackendMonthlyStock) => ({
            month: new Date(0, stock.month - 1).toLocaleString("default", {
              month: "short",
            }),
            revenue: stock.percent_occupied * 1000, // Represents Capacity
            cost: stock.percent_occupied * 800, // Represents Utilization
          })
        );

        setSalesData(processedSalesData);

        // Process product demand for Weekly Inventory Movement
        const processedSupportData = productDemand
          .slice(0, 7) // Take the first 7 entries for daily movement
          .map((demand: BackendProductDemand, index: number) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
            tickets: demand.qty / 10, // Scale for movement
          }));

        setSupportData(processedSupportData);

        // Process trend data (Demand Forecast vs Actual)
        const processedTrendData = productDemand
          .filter(
            (demand: BackendProductDemand) => demand.is_forecast === false
          )
          .map((demand: BackendProductDemand) => {
            const forecast = productDemand.find(
              (d: BackendProductDemand) =>
                d.productId === demand.productId &&
                d.month === demand.month &&
                d.year === demand.year &&
                d.is_forecast === true
            );
            return {
              month: new Date(demand.year, demand.month - 1).toLocaleString(
                "default",
                { month: "short" }
              ),
              forecast: forecast?.qty || 0,
              actual: demand.qty,
            };
          });

        setTrendData(processedTrendData.slice(0, 12)); // Limit to 12 months

        // Process shipping orders from purchase orders
        const processedShippingOrders = purchaseOrders
          .slice(0, 3)
          .map((po: BackendPurchaseOrder) => ({
            id: `#${po.id.toString().padStart(3, "0")}`,
            customer: po.supplier?.name || "Unknown Supplier",
            status: po.status === "Received" ? "Delivered" : po.status,
            date: new Date(po.date_created).toISOString().split("T")[0],
          }));

        setShippingOrders(processedShippingOrders);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient && (session || localStorage.getItem("user"))) {
      loadData();
    }
  }, [isClient, session]); // Add toast to dependencies

  if (!isClient || status === "loading") {
    // If not client-side or session loading, return a full page loader
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={true} /> {/* Or handle session loading state */}
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-700">Loading dashboard data...</p>
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
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Sidebar */}
      <Sidebar visible={sidebarOpen} setVisible={setSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-[180px]" : "ml-0"
        } relative z-10`}
      >
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="p-6 pt-20">
          {/* Search and Filter Bar */}
          <div className="w-full bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-4 mb-6 flex items-center justify-between">
            {/* Search Input */}
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-500" />
              <p className="font-medium text-gray-700">Search Inventory</p>
              <Input
                type="text"
                placeholder="Type here..."
                className="w-auto flex-1 max-w-[250px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Filter Dropdown */}
            <Select onValueChange={() => {}} defaultValue="">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="components">Components</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
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
                        }} // Dynamically generate bg color based on text color
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
                {/* Line Chart - 2/3 width */}
                <Card className="lg:col-span-2 p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Inventory Utilization Trends
                    </h2>
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <p className="text-gray-600">Capacity</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                        <p className="text-gray-600">Utilization</p>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
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
                        dataKey="revenue"
                        stroke="#3b82f6" // blue-500
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Capacity"
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        stroke="#93c5fd" // blue-300
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Utilization"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Bar Chart - 1/3 width */}
                <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Product Demand
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData.slice(-6)}>
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
                        dataKey="revenue"
                        fill="#10b981" // emerald-500
                        radius={[4, 4, 0, 0]}
                        name="Demand"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                {/* Recent Orders Table - 2/3 width */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Recent Purchase Orders
                  </h2>
                  <Card className="p-4 rounded-md border border-gray-300 bg-white/80 shadow-sm backdrop-blur-sm overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PO Number</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shippingOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.id}
                            </TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>
                              <Badge
                
                                className="w-fit"
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>

                {/* Inventory Movement Chart - 1/3 width */}
                <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">
                    Weekly Inventory Movement
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={supportData}>
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
                        dataKey="tickets" // Renamed from tickets to better represent movement
                        fill="#8b5cf6" // violet-500
                        radius={[4, 4, 0, 0]}
                        name="Movement"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Charts Row 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                {/* Demand Forecast Chart – 2/3 width */}
                <Card className="lg:col-span-2 p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Demand Forecast vs Actual
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
                        name="Actual Demand"
                      />
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.2}
                        name="Forecast"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                {/* Inventory Utilization Chart – 1/3 width */}
                <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Inventory Utilization
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={salesData}>
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
                        dataKey="revenue"
                        fill="#f59e0b" // amber-500
                        radius={[4, 4, 0, 0]}
                        name="Capacity"
                      />
                      <Bar
                        dataKey="cost"
                        fill="#3b82f6" // blue-500
                        radius={[4, 4, 0, 0]}
                        name="Utilization"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </>
          )}
        </main>
        <Footer/>
      </div>
    </div>
  );
}
