"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock,
  Loader2,
  ArrowUp,
  ArrowDown,
  Printer,
  Download,
  ArrowRight,
  CheckCircle,
  Package,
  Truck,
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { fetchPurchaseOrder, fetchPOActivities } from "../../services/api1";

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

interface ActivityData {
  timestamp: string;
  activity: string;
  user: string;
  details: string;
}

export default function PurchaseOrderDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [poData, setPoData] = useState<any>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const toast = useToast();

  const poId = params?.id ? params.id.toString() : "";

  useEffect(() => {
    if (status === "loading") return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const loadPOData = async () => {
      if (!poId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [po, activities] = await Promise.all([
          fetchPurchaseOrder(poId),
          fetchPOActivities(poId),
        ]);

        setPoData(po);
        setActivities(activities);

        // Calculate metrics
        const daysUntilDue = po.due_date
          ? Math.floor(
              (new Date(po.due_date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;

        setMetrics([
          {
            title: "PO Status",
            value: po.status,
            change: "",
            changeColor: "text-gray-500",
            extra: po.last_updated || "No updates",
          },
          {
            title: "Due Date",
            value: po.due_date
              ? new Date(po.due_date).toLocaleDateString()
              : "Not set",
            change:
              daysUntilDue > 0
                ? `${daysUntilDue} days remaining`
                : daysUntilDue === 0
                ? "Due today"
                : `${Math.abs(daysUntilDue)} days overdue`,
            changeColor:
              daysUntilDue > 3
                ? "text-green-500"
                : daysUntilDue >= 0
                ? "text-yellow-500"
                : "text-red-500",
            extra: po.priority ? `Priority: ${po.priority}` : "No priority set",
          },
          {
            title: "Total Amount",
            value: `$${po.total_amount?.toFixed(2) || "0.00"}`,
            change: "",
            changeColor: "text-gray-500",
            extra: po.currency || "USD",
          },
          {
            title: "Items",
            value: po.poItems?.length?.toString() || "0",
            change: "",
            changeColor: "text-gray-500",
            extra: po.approved ? "Approved" : "Not approved",
          },
        ]);
      } catch (error) {
        console.error(`Failed to load data for PO ${poId}:`, error);
        toast({
          title: "Error",
          description: `Failed to load data for purchase order ${poId}.`,
          variant: "destructive",
        });
        setPoData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (poId && (session || localStorage.getItem("user"))) {
      loadPOData();
    }
  }, [poId, session]);

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
              Loading purchase order data for ID: {poId}...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!poData && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={!!session || !!localStorage.getItem("user")} />
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="text-lg text-gray-700">
              Purchase order with ID "{poId}" not found or an error occurred.
            </p>
            <Button onClick={() => router.push("/purchase-orders")}>
              Back to Purchase Orders
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "approved":
        return "secondary";
      case "rejected":
        return "destructive";
      case "pending":
        return "outline";
      case "processing":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Truck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

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
          {/* PO Header */}
          <div className="w-full bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Purchase Order #{poData?.po_number}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    variant={getStatusBadgeVariant(poData?.status)}
                    className="flex items-center gap-1"
                  >
                    {getStatusIcon(poData?.status)}
                    {poData?.status}
                  </Badge>
                  <p className="text-gray-600">
                    Supplier:{" "}
                    <span className="font-semibold">
                      {poData?.supplier?.name || "No supplier"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500 mb-2">Created By</p>
                <p className="font-medium">
                  {poData?.created_by?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(poData?.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-center items-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500 mb-2">Approver</p>
                <p className="font-medium">
                  {poData?.approver?.name || "Not assigned"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {poData?.approved_at
                    ? `Approved on ${new Date(
                        poData.approved_at
                      ).toLocaleDateString()}`
                    : "Not approved"}
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
                  {item.change && (
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
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {item.extra}
                  </span>
                </p>
              </Card>
            ))}
          </div>

          {/* Activity Timeline */}
          <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Activity Log
            </h2>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></div>
                      {index !== activities.length - 1 && (
                        <div className="w-px h-10 bg-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between">
                        <p className="font-medium">{activity.activity}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        By: {activity.user}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No activity recorded</p>
              )}
            </div>
          </Card>

          {/* PO Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Purchase Order Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">PO Number</p>
                  <p className="font-medium">{poData?.po_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-medium">
                    {poData?.supplier?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created Date</p>
                  <p className="font-medium">
                    {new Date(poData?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">
                    {poData?.due_date
                      ? new Date(poData.due_date).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Terms</p>
                  <p className="font-medium">
                    {poData?.payment_terms || "Net 30"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Method</p>
                  <p className="font-medium">
                    {poData?.shipping_method || "Standard"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Line Items
              </h2>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poData?.items?.length > 0 ? (
                      poData.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_price?.toFixed(2)}</TableCell>
                          <TableCell>
                            ${(item.quantity * item.unit_price)?.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500"
                        >
                          No items listed for this PO.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Financial Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-medium">
                    ${poData?.subtotal?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tax</p>
                  <p className="font-medium">
                    ${poData?.tax?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping</p>
                  <p className="font-medium">
                    ${poData?.shipping_cost?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium text-blue-600">
                    ${poData?.total_amount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Requestor</p>
                  <p className="font-medium">
                    {poData?.created_by?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {poData?.created_by?.email || "No email"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier Contact</p>
                  <p className="font-medium">
                    {poData?.supplier?.contact_name || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {poData?.supplier?.contact_email || "No email"}
                  </p>
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
