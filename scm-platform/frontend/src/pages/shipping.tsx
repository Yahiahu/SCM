"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  Edit2,
  Trash2,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Package,
  ArrowRight,
  MapPin,
  Loader2, // For loading spinner
} from "lucide-react"; // Replaced react-icons/fi with lucide-react
import { motion } from "framer-motion"; // For animations

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
import { Progress } from "@/components/ui/progress"; // For a progress bar example
import { useToast } from "@/components/ui/use-toast"; // Shadcn/ui toast system

// For the modal, we'll use a custom component that leverages Radix Dialog under the hood.
// Assuming you have a Modal component that looks like this:
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"; // Assuming this is your custom Radix Dialog wrapper
import { Label } from "@/components/ui/label"; // Shadcn Label for form controls
import { Textarea } from "@/components/ui/textarea"; // Shadcn Textarea

import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Dynamically import the Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("../components/shipping-map"), {
  ssr: false,
});

// Re-using the BlurredBackground component from your other pages
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: "In Transit" | "Delivered" | "Exception" | "Pending";
  origin: string;
  destination: string;
  estimatedDelivery: string;
  lastUpdate: string;
  items: number;
  weight: number;
}

export default function ShippingPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Manual modal state
  const toast  = useToast(); // Using shadcn/ui toast

  // Mock data for shipments
  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockShipments: Shipment[] = [
          {
            id: "1",
            trackingNumber: "UPS123456789",
            carrier: "UPS",
            status: "In Transit",
            origin: "New York, NY",
            destination: "Los Angeles, CA",
            estimatedDelivery: "2023-06-15",
            lastUpdate: "2023-06-10 14:30",
            items: 5,
            weight: 12.5,
          },
          {
            id: "2",
            trackingNumber: "FEDEX987654321",
            carrier: "FedEx",
            status: "Delivered",
            origin: "Chicago, IL",
            destination: "Miami, FL",
            estimatedDelivery: "2023-06-08",
            lastUpdate: "2023-06-08 09:15",
            items: 3,
            weight: 8.2,
          },
          {
            id: "3",
            trackingNumber: "USPS456123789",
            carrier: "USPS",
            status: "Exception",
            origin: "Seattle, WA",
            destination: "Boston, MA",
            estimatedDelivery: "2023-06-12",
            lastUpdate: "2023-06-11 16:45",
            items: 7,
            weight: 15.8,
          },
          {
            id: "4",
            trackingNumber: "DHL789456123",
            carrier: "DHL",
            status: "Pending",
            origin: "Houston, TX",
            destination: "Denver, CO",
            estimatedDelivery: "2023-06-18",
            lastUpdate: "2023-06-09 11:20",
            items: 2,
            weight: 5.3,
          },
          {
            id: "5",
            trackingNumber: "UPS321654987",
            carrier: "UPS",
            status: "In Transit",
            origin: "Atlanta, GA",
            destination: "Phoenix, AZ",
            estimatedDelivery: "2023-06-14",
            lastUpdate: "2023-06-11 08:10",
            items: 4,
            weight: 9.7,
          },
        ];

        setShipments(mockShipments);
        setFilteredShipments(mockShipments);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load shipments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Filter shipments
  useEffect(() => {
    let result = [...shipments];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (shipment) =>
          shipment.trackingNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((shipment) => shipment.status === statusFilter);
    }

    setFilteredShipments(result);
  }, [searchTerm, statusFilter, shipments]);

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Delivered":
    case "Paid":
      return "default"; // closest to "success"
    case "Draft":
    case "Cancelled":
      return "destructive";
    case "Submitted":
    case "Approved":
    case "Ordered":
      return "outline";
    default:
      return "secondary";
  }
};


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Transit":
        return <Truck className="h-4 w-4" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "Exception":
        return <AlertTriangle className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleCreateShipment = () => {
    toast({
      title: "Create Shipment",
      description: "Opening shipment creation form...",
    });
    setIsModalOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Export Data",
      description: "Preparing shipment data for export...",
    });
    // In a real app, this would trigger CSV/Excel export
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTrackShipment = (trackingNumber: string) => {
    toast({
      title: "Track Shipment",
      description: `Tracking ${trackingNumber} with carrier...`,
    });
    // In a real app, this would redirect to a tracking page or open a modal
  };

  const shipmentStats = [
    {
      title: "Total Shipments",
      value: shipments.length,
      change: "+12%",
      isIncrease: true,
      icon: Package,
    },
    {
      title: "In Transit",
      value: shipments.filter((s) => s.status === "In Transit").length,
      change: "+5%",
      isIncrease: true,
      icon: Truck,
    },
    {
      title: "Delivered",
      value: shipments.filter((s) => s.status === "Delivered").length,
      change: "+8%",
      isIncrease: true,
      icon: CheckCircle,
    },
    {
      title: "Exceptions",
      value: shipments.filter((s) => s.status === "Exception").length,
      change: "-2%",
      isIncrease: false,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto py-2">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Shipping Dashboard
            </h1>

            <motion.button
              onClick={handleCreateShipment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-medium shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Shipment
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {shipmentStats.map((stat, index) => (
              <Card key={index} className="p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm flex items-center ${
                        stat.isIncrease ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.isIncrease ? (
                        <span className="inline-block transform rotate-180">
                          &#9650;
                        </span>
                      ) : (
                        <span className="inline-block">&#9660;</span>
                      )}
                      {stat.change}
                    </p>
                  </div>
                  <stat.icon className="h-7 w-7 text-blue-600" />
                </div>
              </Card>
            ))}
          </div>

          {/* Map View */}
          <Card className="shadow-sm h-[400px] mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Shipment Tracking Map
              </h2>
            </div>
            <div className="h-full w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                </div>
              ) : (
                <MapWithNoSSR shipments={filteredShipments} />
              )}
            </div>
          </Card>

          {/* Search and Filter */}
          <Card className="shadow-sm mb-6">
            <div className="p-6 flex flex-wrap gap-4 items-center">
              <div className="flex items-center flex-1 min-w-[300px] gap-2">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  name="statusFilter"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Exception">Exception</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </Card>

          {/* Shipments Table */}
          <Card className="shadow-sm overflow-auto">
            {isLoading ? (
              <div className="p-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded mb-2 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Weight (lbs)</TableHead>
                    <TableHead>Est. Delivery</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow
                      key={shipment.id}
                      onClick={() => router.push(`/shipments/${shipment.id}`)}
                      className="cursor-pointer hover:bg-sky-100 transition"
                    >
                      <TableCell className="font-medium">
                        {shipment.trackingNumber}
                      </TableCell>
                      <TableCell>{shipment.carrier}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(shipment.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(shipment.status)}
                          {shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{shipment.origin}</span>
                          <ArrowRight className="mx-auto my-1 h-4 w-4" />
                          <span>{shipment.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.items}</TableCell>
                      <TableCell>{shipment.weight}</TableCell>
                      <TableCell>{shipment.estimatedDelivery}</TableCell>
                      <TableCell>{shipment.lastUpdate}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleTrackShipment(shipment.trackingNumber)
                          }
                          className="flex items-center gap-1"
                        >
                          <MapPin className="h-4 w-4" />
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredShipments.length === 0 && !isLoading && (
              <div className="p-8 text-center text-gray-500">
                No shipments found. Try adjusting your filters.
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />

      {/* Create Shipment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-6 bg-white rounded-lg shadow-xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Create New Shipment
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill in the details for the new shipment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrier" className="text-right">
                Carrier
              </Label>
              <Select defaultValue="" name="carrier">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origin" className="text-right">
                Origin
              </Label>
              <Input
                id="origin"
                placeholder="City, State"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destination" className="text-right">
                Destination
              </Label>
              <Input
                id="destination"
                placeholder="City, State"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="items" className="text-right">
                Number of Items
              </Label>
              <Input
                id="items"
                type="number"
                placeholder="e.g., 5"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Total Weight (lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 12.5"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructions" className="text-right">
                Special Instructions
              </Label>
              <Textarea
                id="instructions"
                placeholder="Fragile, temperature sensitive, etc."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-700">
              Create Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
