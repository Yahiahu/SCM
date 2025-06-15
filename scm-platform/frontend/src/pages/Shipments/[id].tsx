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
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  ArrowUp,
  ArrowDown,
  MapPin,
  Printer,
  Download,
  ArrowRight,
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

import {
  fetchShipment,
  fetchShipmentHistory,
  fetchShipmentEvents,
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

interface HistoryData {
  date: string;
  status: string;
  location: string;
}

interface EventData {
  timestamp: string;
  event: string;
  location: string;
  details: string;
}

export default function ShipmentDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [shipmentData, setShipmentData] = useState<any>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const toast = useToast();

  const shipmentId = params?.id ? params.id.toString() : "";

  useEffect(() => {
    if (status === "loading") return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const loadShipmentData = async () => {
      if (!shipmentId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [shipment, history, events] = await Promise.all([
          fetchShipment(shipmentId),
          fetchShipmentHistory(shipmentId),
          fetchShipmentEvents(shipmentId),
        ]);

        setShipmentData(shipment);
        setHistoryData(history);
        setEvents(events);

        // Calculate metrics
        const transitTime = shipment.estimated_delivery
          ? Math.floor(
              (new Date(shipment.estimated_delivery).getTime() -
                new Date(shipment.shipment_date).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;

        setMetrics([
          {
            title: "Current Status",
            value: shipment.status,
            change: "",
            changeColor: "text-gray-500",
            extra: shipment.last_update || "No updates",
          },
          {
            title: "Transit Time",
            value: `${transitTime} days`,
            change: "",
            changeColor: "text-gray-500",
            extra: shipment.estimated_delivery
              ? `Est. delivery: ${new Date(
                  shipment.estimated_delivery
                ).toLocaleDateString()}`
              : "No ETA",
          },
          {
            title: "Items",
            value: shipment.items_count?.toString() || "0",
            change: "",
            changeColor: "text-gray-500",
            extra: `${shipment.weight || "0"} kg`,
          },
          {
            title: "Shipment Value",
            value: `$${shipment.value?.toFixed(2) || "0.00"}`,
            change: "",
            changeColor: "text-gray-500",
            extra: shipment.insurance
              ? `Insured: $${shipment.insurance}`
              : "Not insured",
          },
        ]);
      } catch (error) {
        console.error(`Failed to load data for shipment ${shipmentId}:`, error);
        toast({
          title: "Error",
          description: `Failed to load data for shipment ${shipmentId}.`,
          variant: "destructive",
        });
        setShipmentData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (shipmentId && (session || localStorage.getItem("user"))) {
      loadShipmentData();
    }
  }, [shipmentId, session]);

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
              Loading shipment data for ID: {shipmentId}...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!shipmentData && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
        <BlurredBackground />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Navbar isLoggedIn={!!session || !!localStorage.getItem("user")} />
        <main className="flex flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="text-lg text-gray-700">
              Shipment with ID "{shipmentId}" not found or an error occurred.
            </p>
            <Button onClick={() => router.push("/shipments")}>
              Back to Shipments
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "in transit":
        return "secondary";
      case "exception":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "exception":
        return <AlertTriangle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
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
          {/* Shipment Header */}
          <div className="w-full bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Shipment #{shipmentData?.tracking_number}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    variant={getStatusBadgeVariant(shipmentData?.status)}
                    className="flex items-center gap-1"
                  >
                    {getStatusIcon(shipmentData?.status)}
                    {shipmentData?.status}
                  </Badge>
                  <p className="text-gray-600">
                    Carrier:{" "}
                    <span className="font-semibold">
                      {shipmentData?.carrier}
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
                <p className="text-sm text-gray-500 mb-2">Origin</p>
                <p className="font-medium">{shipmentData?.origin}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(shipmentData?.shipment_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-center items-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500 mb-2">Destination</p>
                <p className="font-medium">{shipmentData?.destination}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {shipmentData?.estimated_delivery
                    ? `Est. ${new Date(
                        shipmentData.estimated_delivery
                      ).toLocaleDateString()}`
                    : "No ETA"}
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

          {/* Tracking Timeline */}
          <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Tracking History
            </h2>
            <div className="space-y-4">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></div>
                      {index !== events.length - 1 && (
                        <div className="w-px h-10 bg-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.details}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tracking events available</p>
              )}
            </div>
          </Card>

          {/* Shipment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Shipment Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-medium">{shipmentData?.tracking_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carrier</p>
                  <p className="font-medium">{shipmentData?.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipment Date</p>
                  <p className="font-medium">
                    {new Date(shipmentData?.shipment_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">
                    {shipmentData?.estimated_delivery
                      ? new Date(
                          shipmentData.estimated_delivery
                        ).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{shipmentData?.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium">
                    {shipmentData?.dimensions || "Not specified"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Contents
              </h2>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipmentData?.items?.length > 0 ? (
                      shipmentData.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.value?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500"
                        >
                          No items listed for this shipment.
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
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service Level</p>
                  <p className="font-medium">
                    {shipmentData?.service_level || "Standard"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Account</p>
                  <p className="font-medium">
                    {shipmentData?.billing_account || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium">
                    {shipmentData?.reference || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p className="font-medium">
                    {shipmentData?.insurance
                      ? `$${shipmentData.insurance}`
                      : "Not insured"}
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
                  <p className="text-sm text-gray-500">Shipper</p>
                  <p className="font-medium">{shipmentData?.shipper_name}</p>
                  <p className="text-sm text-gray-600">
                    {shipmentData?.shipper_contact}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="font-medium">{shipmentData?.recipient_name}</p>
                  <p className="text-sm text-gray-600">
                    {shipmentData?.recipient_contact}
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
