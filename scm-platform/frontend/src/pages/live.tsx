import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Warehouse,
  Users,
  BarChart3,
  Zap,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Download,
  Bell,
  ArrowRight,
  Box,
  Globe,
  Signal,
  Battery,
  Wifi,
  Calendar,
  ShoppingCart,
  Building,
  Target,
  AlertCircle,
  XCircle,
  Pause,
  Play,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Define types
type CardProps = {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
};

type ButtonProps = {
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: any;
};

type BadgeProps = {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "premium"
    | "info";
  className?: string;
};

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  status: "good" | "low" | "critical" | "out";
  lastUpdated: Date;
  category: string;
  value: number;
};

type ShipmentStatus = {
  id: string;
  orderId: string;
  supplier: string;
  destination: string;
  status: "in_transit" | "delivered" | "delayed" | "cancelled";
  estimatedArrival: Date;
  currentLocation: string;
  progress: number;
};

type WarehouseMetrics = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  utilized: number;
  temperature: number;
  humidity: number;
  status: "operational" | "maintenance" | "offline";
  alerts: number;
};

// Enhanced components
const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg shadow-blue-100/30 hover:shadow-xl hover:shadow-blue-200/40 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95";
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50/50 shadow-sm hover:shadow-md",
    secondary:
      "bg-blue-100 text-blue-900 hover:bg-blue-200 shadow-sm hover:shadow-md",
    ghost: "hover:bg-blue-100/50 hover:shadow-sm text-blue-800",
    link: "underline-offset-4 hover:underline text-blue-600 hover:text-blue-700",
    gradient:
      "bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 shadow-lg hover:shadow-xl shadow-blue-500/20",
  };
  const sizes = {
    default: "h-12 py-3 px-6 text-sm",
    sm: "h-10 px-4 text-sm rounded-lg",
    lg: "h-14 px-8 text-base rounded-xl",
    icon: "h-12 w-12",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "bg-blue-600 text-white",
    secondary: "bg-blue-100 text-blue-800",
    destructive: "bg-red-500 text-white",
    outline: "border-2 border-blue-200 text-blue-800 bg-white",
    success: "bg-emerald-500 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-sky-500 text-white",
    premium: "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default function LiveInventorySupplyChain() {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedView, setSelectedView] = useState<
    "inventory" | "shipments" | "warehouses"
  >("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState(7);

  // Mock data
  const inventoryData: InventoryItem[] = [
    {
      id: "1",
      name: "Industrial Pump Unit",
      sku: "IPU-2024-001",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      location: "Warehouse A - Section 3",
      status: "good",
      lastUpdated: new Date(),
      category: "Equipment",
      value: 2500,
    },
    {
      id: "2",
      name: "Steel Pipe 6in",
      sku: "SP6-2024-002",
      currentStock: 12,
      minStock: 25,
      maxStock: 200,
      location: "Warehouse B - Section 1",
      status: "low",
      lastUpdated: new Date(),
      category: "Materials",
      value: 150,
    },
    {
      id: "3",
      name: "Safety Valve Assembly",
      sku: "SVA-2024-003",
      currentStock: 3,
      minStock: 10,
      maxStock: 50,
      location: "Warehouse A - Section 2",
      status: "critical",
      lastUpdated: new Date(),
      category: "Components",
      value: 800,
    },
    {
      id: "4",
      name: "Hydraulic Fluid 20L",
      sku: "HF20-2024-004",
      currentStock: 0,
      minStock: 15,
      maxStock: 80,
      location: "Warehouse C - Section 4",
      status: "out",
      lastUpdated: new Date(),
      category: "Fluids",
      value: 120,
    },
  ];

  const shipmentData: ShipmentStatus[] = [
    {
      id: "SH001",
      orderId: "PO-2024-0156",
      supplier: "TechCorp Industries",
      destination: "Warehouse A",
      status: "in_transit",
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      currentLocation: "Distribution Center - Toronto",
      progress: 65,
    },
    {
      id: "SH002",
      orderId: "PO-2024-0157",
      supplier: "Steel Works Ltd",
      destination: "Warehouse B",
      status: "delayed",
      estimatedArrival: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      currentLocation: "Port Authority - Montreal",
      progress: 40,
    },
    {
      id: "SH003",
      orderId: "PO-2024-0158",
      supplier: "Component Solutions",
      destination: "Warehouse A",
      status: "delivered",
      estimatedArrival: new Date(),
      currentLocation: "Delivered",
      progress: 100,
    },
  ];

  const warehouseData: WarehouseMetrics[] = [
    {
      id: "WH-A",
      name: "Warehouse A",
      location: "Toronto, ON",
      capacity: 10000,
      utilized: 7500,
      temperature: 22.5,
      humidity: 45,
      status: "operational",
      alerts: 2,
    },
    {
      id: "WH-B",
      name: "Warehouse B",
      location: "Vancouver, BC",
      capacity: 8000,
      utilized: 6200,
      temperature: 21.8,
      humidity: 48,
      status: "operational",
      alerts: 0,
    },
    {
      id: "WH-C",
      name: "Warehouse C",
      location: "Calgary, AB",
      capacity: 6000,
      utilized: 3800,
      temperature: 23.1,
      humidity: 42,
      status: "maintenance",
      alerts: 1,
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "operational":
      case "delivered":
        return "success";
      case "low":
      case "delayed":
      case "maintenance":
        return "warning";
      case "critical":
        return "destructive";
      case "out":
      case "cancelled":
      case "offline":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "operational":
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "low":
      case "delayed":
      case "maintenance":
        return <AlertTriangle className="w-4 h-4" />;
      case "critical":
      case "out":
      case "cancelled":
      case "offline":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Auto-refresh when live mode is enabled
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLiveMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 overflow-x-hidden relative pt-20">
      <Navbar isLoggedIn={true} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-sky-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-4 rounded-2xl shadow-lg mr-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-sky-800 bg-clip-text text-transparent">
                    Live Supply Chain
                  </h1>
                  <p className="text-blue-800/80 text-lg mt-1">
                    Real-time inventory tracking and supply chain monitoring
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Live Mode Toggle */}
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-blue-200">
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isLiveMode
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                      : "text-blue-700"
                  }`}
                >
                  {isLiveMode ? (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-medium">LIVE</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      <span className="text-sm font-medium">Paused</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {isLiveMode ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button variant="outline" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
                {notifications > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <Button
                variant="gradient"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Last Updated & Status */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-blue-600/70">
              <Clock className="w-4 h-4 mr-2" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Signal className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-600 font-medium">
                  Connected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* View Selector */}
        <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-blue-200 mb-8 w-fit">
          {[
            { key: "inventory", label: "Inventory", icon: Package },
            { key: "shipments", label: "Shipments", icon: Truck },
            { key: "warehouses", label: "Warehouses", icon: Warehouse },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedView(key as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedView === key
                  ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md"
                  : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 w-80"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Content based on selected view */}
        <AnimatePresence mode="wait">
          {selectedView === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6"
            >
              {/* Inventory Overview Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-sky-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-3 rounded-xl">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="info">Total</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
                        Total Items
                      </h3>
                      <div className="text-3xl font-bold text-blue-900">
                        1,247
                      </div>
                      <p className="text-sm text-blue-600/70">
                        Across all locations
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="success">Good</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
                        In Stock
                      </h3>
                      <div className="text-3xl font-bold text-blue-900">
                        1,089
                      </div>
                      <p className="text-sm text-blue-600/70">
                        87.3% availability
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="warning">Low</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
                        Low Stock
                      </h3>
                      <div className="text-3xl font-bold text-blue-900">
                        143
                      </div>
                      <p className="text-sm text-blue-600/70">
                        Need reordering
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
                        Out of Stock
                      </h3>
                      <div className="text-3xl font-bold text-blue-900">15</div>
                      <p className="text-sm text-blue-600/70">
                        Urgent action needed
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Inventory Items List */}
              <Card>
                <div className="p-6 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900">
                    Inventory Items
                  </h3>
                  <p className="text-sm text-blue-600/70 mt-1">
                    Real-time stock levels and status
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Item
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Stock Level
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Location
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Value
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-blue-100/50 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-blue-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-blue-600/70">
                                {item.sku}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-blue-900">
                                  {item.currentStock}
                                </span>
                                <span className="text-sm text-blue-600/70">
                                  / {item.maxStock}
                                </span>
                              </div>
                              <div className="w-full bg-blue-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    item.status === "good"
                                      ? "bg-emerald-500"
                                      : item.status === "low"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${
                                      (item.currentStock / item.maxStock) * 100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-blue-700">
                                {item.location}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={getStatusColor(item.status)}
                              className="capitalize"
                            >
                              {getStatusIcon(item.status)}
                              <span className="ml-1">{item.status}</span>
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              $
                              {(
                                item.currentStock * item.value
                              ).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <ShoppingCart className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {selectedView === "shipments" && (
            <motion.div
              key="shipments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Shipment Status Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-3 rounded-xl">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={getStatusColor(shipmentData[0].status)}>
                        {shipmentData[0].status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
                        Delayed Shipments
                      </h3>
                      <div className="text-3xl font-bold text-blue-900">2</div>
                      <p className="text-sm text-blue-600/70">Check ETA</p>
                    </div>
                  </div>
                </Card>
                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="success">Delivered</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
                        Delivered
                      </h3>
                      <div className="text-3xl font-bold text-blue-900">5</div>
                      <p className="text-sm text-blue-600/70">On time</p>
                    </div>
                  </div>
                </Card>
              </div>
              {/* Shipments List Placeholder */}
              <Card>
                <div className="p-6 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900">Shipments</h3>
                  <p className="text-sm text-blue-600/70 mt-1">
                    Live shipment tracking
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Order ID
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Supplier
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Destination
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          ETA
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipmentData.map((shipment, index) => (
                        <motion.tr
                          key={shipment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-blue-100/50 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="p-4 font-semibold text-blue-900">
                            {shipment.orderId}
                          </td>
                          <td className="p-4 text-blue-700">
                            {shipment.supplier}
                          </td>
                          <td className="p-4 text-blue-700">
                            {shipment.destination}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={getStatusColor(shipment.status)}
                              className="capitalize"
                            >
                              {getStatusIcon(shipment.status)}
                              <span className="ml-1">
                                {shipment.status.replace("_", " ")}
                              </span>
                            </Badge>
                          </td>
                          <td className="p-4 text-blue-700">
                            {shipment.estimatedArrival.toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="w-full bg-blue-100 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${shipment.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-blue-600/70 ml-2">
                              {shipment.progress}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {selectedView === "warehouses" && (
            <motion.div
              key="warehouses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Warehouse Metrics Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {warehouseData.map((wh) => (
                  <Card key={wh.id} className="overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-sky-500"></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-3 rounded-xl">
                          <Warehouse className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant={getStatusColor(wh.status)}>
                          {wh.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
                          {wh.name}
                        </h3>
                        <div className="text-2xl font-bold text-blue-900">
                          {wh.utilized} / {wh.capacity}
                        </div>
                        <p className="text-sm text-blue-600/70">
                          {wh.location}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Battery className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs text-emerald-700">
                            {((wh.utilized / wh.capacity) * 100).toFixed(1)}%
                            utilized
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-blue-700">
                            {wh.temperature}°C, {wh.humidity}% RH
                          </span>
                        </div>
                        {wh.alerts > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-700">
                              {wh.alerts} alerts
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* End AnimatePresence */}

        {/* Footer */}
        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </div>
  );
}
