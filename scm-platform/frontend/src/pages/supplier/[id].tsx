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
  Loader2,
  ArrowUp,
  ArrowDown,
  Star,
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  fetchSupplier,
  fetchSupplierPerformance,
  fetchSupplierComponents,
  fetchSupplierPurchaseOrders,
} from "../../services/api1";

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

interface PerformanceData {
  month: string;
  onTimeRate: number;
  qualityScore: number;
}

interface ComponentData {
  id: string;
  name: string;
  quantity: number;
  lastOrderDate: string;
}

interface PurchaseOrder {
  id: string;
  component: string;
  status: string;
  date: string;
  quantity: number;
  unitPrice: number;
}

export default function SupplierDetailDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [supplierData, setSupplierData] = useState<any>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const toast = useToast();

  const supplierId = params?.id ? params.id.toString() : "";

  useEffect(() => {
    if (status === "loading") return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const loadSupplierData = async () => {
      if (!supplierId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [supplier, performance, components, orders] = await Promise.all([
          fetchSupplier(supplierId),
          fetchSupplierPerformance(supplierId),
          fetchSupplierComponents(supplierId),
          fetchSupplierPurchaseOrders(supplierId),
        ]);

        setSupplierData(supplier);

        // Calculate metrics
        const avgOnTimeRate =
          performance.reduce((sum: any, p: { onTimeRate: any; }) => sum + p.onTimeRate, 0) /
          performance.length;
        const currentYearPerformance = performance.slice(0, 12);

        setMetrics([
          {
            title: "On-Time Delivery",
            value: `${(avgOnTimeRate * 100).toFixed(1)}%`,
            change:
              performance.length > 1
                ? `${(
                    (performance[0].onTimeRate - performance[1].onTimeRate) *
                    100
                  ).toFixed(1)}%`
                : "0%",
            changeColor:
              performance.length > 1 &&
              performance[0].onTimeRate > performance[1].onTimeRate
                ? "text-green-500"
                : "text-red-500",
            extra: "last 12 months",
            isIncrease:
              performance.length > 1 &&
              performance[0].onTimeRate > performance[1].onTimeRate,
          },
          {
            title: "Active Components",
            value: components.length.toString(),
            change: "—",
            changeColor: "text-gray-500",
            extra: "components supplied",
          },
          {
            title: "Avg. Response Time",
            value: `${supplier.last_response_time || 24} hrs`,
            change: "—",
            changeColor: "text-gray-500",
            extra: "to inquiries",
          },
          {
            title: "Purchase Orders",
            value: orders.length.toString(),
            change: orders.length > 0 ? "+" : "0",
            changeColor: "text-blue-500",
            extra: "last 30 days",
            isIncrease: true,
          },
        ]);

        // Process performance data
        const processedPerformanceData = currentYearPerformance.map((p: { month: string; onTimeRate: number; qualityScore: number; }) => ({
          month: new Date(0, parseInt(p.month) - 1).toLocaleString("default", {
            month: "short",
          }),
          onTimeRate: p.onTimeRate * 100,
          qualityScore: p.qualityScore * 100,
        }));
        setPerformanceData(processedPerformanceData);

        // Process components
        const processedComponents = components.slice(0, 5).map((c) => ({
          id: c.id.toString(),
          name: c.name,
          quantity: c.quantity,
          lastOrderDate: c.last_order_date
            ? new Date(c.last_order_date).toISOString().split("T")[0]
            : "N/A",
        }));

        setComponents(processedComponents);

        // Process purchase orders
const processedOrders = orders.slice(0, 5).map((o) => ({
  id: `#${o.id.toString().padStart(3, "0")}`,
  component: o.componentName,
  status: o.status,
  date: o.date ? new Date(o.date).toISOString().split("T")[0] : "N/A",
  quantity: o.quantity,
  unitPrice: o.unitPrice,
}));

        setPurchaseOrders(processedOrders);
      } catch (error) {
        console.error(`Failed to load data for supplier ${supplierId}:`, error);
        toast({
          title: "Error",
          description: `Failed to load data for supplier ${supplierId}.`,
          variant: "destructive",
        });
        setSupplierData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (supplierId && (session || localStorage.getItem("user"))) {
      loadSupplierData();
    }
  }, [supplierId, session]);

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
              Loading supplier data for ID: {supplierId}...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!supplierData && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={!!session || !!localStorage.getItem("user")} />
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg text-gray-700">
              Supplier with ID "{supplierId}" not found or an error occurred.
            </p>
            <Button onClick={() => router.push("/suppliers")}>
              Back to Suppliers
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
          {/* Supplier Header */}
          <div className="w-full bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {supplierData?.name}
                </h1>
                <p className="text-gray-600 mb-4">
                  Supplier ID:{" "}
                  <span className="font-semibold">{supplierData?.id}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={supplierData?.preferred ? "default" : "secondary"}
                  >
                    {supplierData?.preferred ? "Preferred" : "Standard"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {supplierData?.rating?.toFixed(1) || "4.0"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Order</p>
                <p className="font-medium">
                  {purchaseOrders[0]?.date || "No recent orders"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{supplierData?.contact_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{supplierData?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{supplierData?.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Lead Time</p>
                <p className="font-medium">
                  {supplierData?.avg_lead_time || "N/A"} days
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
                  <span className="font-semibold text-gray-700">
                    {item.extra}
                  </span>
                </p>
              </Card>
            ))}
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Performance Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
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
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Value"]}
                    contentStyle={{
                      borderRadius: "0.5rem",
                      borderColor: "#e0e0e0",
                      backgroundColor: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="onTimeRate"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="On-Time %"
                  />
                  <Line
                    type="monotone"
                    dataKey="qualityScore"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Quality %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Performance Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    On-Time Delivery (Avg)
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics[0]?.value || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quality Score (Avg)</p>
                  <p className="text-2xl font-bold">
                    {performanceData.length > 0
                      ? `${(
                          performanceData.reduce(
                            (sum, p) => sum + p.qualityScore,
                            0
                          ) / performanceData.length
                        ).toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Response Time</p>
                  <p className="text-2xl font-bold">
                    {supplierData?.last_response_time || "N/A"} hours
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Components and Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Top Supplied Components
              </h2>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {components.length > 0 ? (
                      components.map((component) => (
                        <TableRow key={component.id}>
                          <TableCell className="font-medium">
                            {component.name}
                          </TableCell>
                          <TableCell>{component.lastOrderDate}</TableCell>
                          <TableCell>{component.quantity}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500"
                        >
                          No components found for this supplier.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Purchase Orders
              </h2>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableHead>PO #</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.length > 0 ? (
                      purchaseOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.component}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "Delivered"
                                  ? "default"
                                  : order.status === "Pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${(order.quantity * order.unitPrice).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500"
                        >
                          No recent purchase orders.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Supplier Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">
                    {supplierData?.description || "No description available."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Contract Start</p>
                    <p className="font-medium">
                      {supplierData?.contract_start_date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contract End</p>
                    <p className="font-medium">
                      {supplierData?.contract_end_date || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Performance Metrics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Historical On-Time Rate
                  </p>
                  <p className="font-medium">
                    {(supplierData?.historical_ontime_rate * 100)?.toFixed(1) ||
                      "N/A"}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Unit Cost</p>
                  <p className="font-medium">
                    ${supplierData?.avg_unit_cost?.toFixed(2) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Response Time</p>
                  <p className="font-medium">
                    {supplierData?.last_response_time || "N/A"} hours
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Components</p>
                  <p className="font-medium">{components.length || "0"}</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
