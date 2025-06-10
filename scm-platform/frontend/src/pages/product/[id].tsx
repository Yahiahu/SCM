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
import { useRouter } from "next/router";

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
  fetchMonthlyStockByProduct, // Modified to fetch by product
  fetchProductDemandByProduct, // Modified to fetch by product
  fetchShippingInfo, // Keep if still needed for general overview
  fetchPurchaseOrders, // Keep if still needed for general overview
  fetchWarehouseInventoryByProduct, // Modified to fetch by product
  fetchProduct, // NEW: For fetching single product details
} from "../../services/api1"; // Adjust path if needed

// Types matching your backend
import {
  MonthlyStock as BackendMonthlyStock,
  ProductDemand as BackendProductDemand,
  ShippingInfo as BackendShippingInfo,
  PurchaseOrder as BackendPurchaseOrder,
  WarehouseInventory as BackendWarehouseInventory,
  Component as BackendComponent, // Keep if components are part of product BOM
  Product as BackendProduct,
  BOM as BackendBOM, // Keep if BOMs are part of product details
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

export default function ProductDetailDashboard() {
  // Renamed component for clarity
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [supportData, setSupportData] = useState<SupportData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([]);

  const [productData, setProductData] = useState<BackendProduct | null>(null); // State for single product data
  const [productComponents, setProductComponents] = useState<
    BackendComponent[]
  >([]); // Components for this product
  const [productBOM, setProductBOM] = useState<BackendBOM[]>([]); // BOM for this product

  const { data: session, status } = useSession();
  const router = useRouter();
  const  toast  = useToast();


const productId = typeof router.query.id === "string" ? router.query.id : "";

  useEffect(() => {
    if (status === "loading") return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Load product-specific data from backend
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch the specific product details
        const product = await fetchProduct(productId);
        setProductData(product);

        // Fetch product-specific data for charts and metrics
        const [
          monthlyStock,
          productDemand,
          warehouseInventory,
          purchaseOrders, // Still fetching general purchase orders for recent POs
        ] = await Promise.all([
          fetchMonthlyStockByProduct(productId),
          fetchProductDemandByProduct(productId),
          fetchWarehouseInventoryByProduct(productId),
          fetchPurchaseOrders(), // Fetch all purchase orders and filter later
        ]);

        // Filter components and BOMs relevant to this product
        // This assumes your product object or another API call can provide this
        // For now, let's assume `product.components` and `product.boms` exist if provided by `fetchProduct`
        // Or you'd need dedicated API calls for `fetchComponentsByProduct` and `fetchBOMsByProduct`
        // For demonstration, we'll use example filtering based on existing data if not product-specific APIs exist.
        // If your backend doesn't provide this directly, you'll need to adapt.
        const relevantWarehouseItem = warehouseInventory.find(
          (item) => item.product_id === product.id
        );

        const lowStockItems =
          relevantWarehouseItem &&
          relevantWarehouseItem.current_qty <
            (relevantWarehouseItem.product?.min_stock_level ?? 10)
            ? 1
            : 0;
        const outOfStockItems =
          relevantWarehouseItem && relevantWarehouseItem.current_qty <= 0
            ? 1
            : 0;

        setMetrics([
          {
            title: `Current Stock (${product.name})`,
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
            title: "Average Daily Demand",
            value: (
              productDemand.reduce((sum, d) => sum + d.qty, 0) /
                productDemand.length || 0
            ).toFixed(1),
            change: "—",
            changeColor: "text-gray-500",
            extra: "units/day (last 30 days)",
            isIncrease: true,
          },
        ]);

        // Process monthly stock data for sales charts (Inventory Utilization) for this product
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

        // Process trend data (Demand Forecast vs Actual) for this product
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

        // Process shipping orders relevant to this product
        const processedShippingOrders = purchaseOrders
          .filter((po) => po.product_id === product.id) // Filter by current product ID
          .slice(0, 3)
          .map((po: BackendPurchaseOrder) => ({
            id: `#${po.id.toString().padStart(3, "0")}`,
            customer: po.supplier?.name || "Unknown Supplier",
            status: po.status === "Received" ? "Delivered" : po.status,
            date: new Date(po.date_created).toISOString().split("T")[0],
          }));
        setShippingOrders(processedShippingOrders);
      } catch (error) {
        console.error(`Failed to load data for product ${productId}:`, error);
        toast({
          title: "Error",
          description: `Failed to load data for product ${productId}.`,
          variant: "destructive",
        });
        setProductData(null); // Clear product data on error
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && (session || localStorage.getItem("user"))) {
      loadProductData();
    } else if (!productId) {
      setIsLoading(false); // If no product ID, stop loading and potentially show a message
    }
  }, [productId, session]); // Rerun when productId or session changes

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
              Loading product data for ID: {productId}...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!productData && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={!!session || !!localStorage.getItem("user")} />
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg text-gray-700">
              Product with ID "{productId}" not found or an error occurred.
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
          {/* Product Header */}
          <div className="w-full bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {productData?.name}
            </h1>
            <p className="text-gray-600 mb-4">
              Product ID:{" "}
              <span className="font-semibold">{productData?.id}</span> |
              Category:{" "}
              <span className="font-semibold">
              </span>
            </p>
            <p className="text-gray-700">
              {productData?.description || "No description available."}
            </p>
            {/* Add more product-specific details here */}
          </div>

          {/* Metrics Cards - Now product-specific */}
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

          {/* Charts Row 1 - Now product-specific */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Inventory Utilization Trends for {productData?.name}
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
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Capacity"
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#93c5fd"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Utilization"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Product Demand for {productData?.name}
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
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Demand"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 2 - Now product-specific */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Purchase Orders for {productData?.name}
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
                    {shippingOrders.length > 0 ? (
                      shippingOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            <Badge className="w-fit">{order.status}</Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500"
                        >
                          No recent purchase orders for this product.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Weekly Inventory Movement for {productData?.name}
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
                    dataKey="tickets"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Movement"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 3 - Now product-specific */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            <Card className="lg:col-span-2 p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Demand Forecast vs Actual for {productData?.name}
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
                    fill="#82ca94"
                    fillOpacity={0.2}
                    name="Forecast"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Inventory Utilization for {productData?.name}
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
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    name="Capacity"
                  />
                  <Bar
                    dataKey="cost"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Utilization"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
