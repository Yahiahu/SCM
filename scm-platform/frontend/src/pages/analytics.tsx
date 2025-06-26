import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  PieChart,
  LineChart,
  DollarSign,
  Users,
  ShoppingBag,
  CreditCard,
  Globe,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Settings,
  ChevronDown,
  MoreHorizontal,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  Eye,
  Box,
  Package,
  Truck,
  Warehouse,
  ClipboardList,
  Layers,
  Clock4,
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

type MetricCardProps = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  leadTime: number;
  status: "good" | "low" | "critical" | "out";
};

type Supplier = {
  id: string;
  name: string;
  rating: number;
  deliveryTime: number;
  reliability: number;
  lastOrderDate: string;
};

type EOQData = {
  itemId: string;
  itemName: string;
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  eoq: number;
  optimalOrderFrequency: number;
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

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-3 rounded-xl">
        {icon}
      </div>
      <Badge variant={trend === "up" ? "success" : "destructive"}>
        {trend === "up" ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span className="ml-1">{change}%</span>
      </Badge>
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
        {title}
      </h3>
      <div className="text-3xl font-bold text-blue-900">{value}</div>
      <p className="text-sm text-blue-600/70">
        {trend === "up" ? "Increase" : "Decrease"} from last period
      </p>
    </div>
  </Card>
);

// EOQ Calculator Component
const EOQCalculator = () => {
  const [demand, setDemand] = useState(1000);
  const [orderingCost, setOrderingCost] = useState(50);
  const [holdingCost, setHoldingCost] = useState(2);
  const [result, setResult] = useState<{
    eoq: number;
    frequency: number;
  } | null>(null);

  const calculateEOQ = () => {
    const eoq = Math.sqrt((2 * demand * orderingCost) / holdingCost);
    const frequency = demand / eoq;
    setResult({
      eoq: Math.round(eoq),
      frequency: Math.round(frequency * 100) / 100,
    });
  };

  useEffect(() => {
    calculateEOQ();
  }, [demand, orderingCost, holdingCost]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-blue-900 mb-6">EOQ Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Annual Demand (units)
          </label>
          <input
            type="number"
            value={demand}
            onChange={(e) => setDemand(Number(e.target.value))}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Ordering Cost ($ per order)
          </label>
          <input
            type="number"
            value={orderingCost}
            onChange={(e) => setOrderingCost(Number(e.target.value))}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Holding Cost ($ per unit per year)
          </label>
          <input
            type="number"
            value={holdingCost}
            onChange={(e) => setHoldingCost(Number(e.target.value))}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600/70">
                Economic Order Quantity
              </p>
              <p className="text-xl font-bold text-blue-900">
                {result.eoq} units
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600/70">
                Optimal Order Frequency
              </p>
              <p className="text-xl font-bold text-blue-900">
                {result.frequency} times/year
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default function SCMSupplyChainDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "12m">(
    "30d"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState<
    "overview" | "inventory" | "suppliers" | "orders" | "analytics"
  >("overview");

  // Mock inventory data
  const inventoryData: InventoryItem[] = [
    {
      id: "1",
      name: "Wireless Earbuds Pro",
      category: "Electronics",
      currentStock: 45,
      reorderPoint: 30,
      leadTime: 7,
      status: "good",
    },
    {
      id: "2",
      name: "Smart Watch Series 5",
      category: "Electronics",
      currentStock: 12,
      reorderPoint: 25,
      leadTime: 14,
      status: "low",
    },
    {
      id: "3",
      name: "Bluetooth Speaker",
      category: "Electronics",
      currentStock: 8,
      reorderPoint: 15,
      leadTime: 10,
      status: "critical",
    },
    {
      id: "4",
      name: "Organic Cotton T-Shirt",
      category: "Apparel",
      currentStock: 0,
      reorderPoint: 50,
      leadTime: 21,
      status: "out",
    },
    {
      id: "5",
      name: "Stainless Steel Water Bottle",
      category: "Accessories",
      currentStock: 62,
      reorderPoint: 40,
      leadTime: 5,
      status: "good",
    },
  ];

  // Mock supplier data
  const supplierData: Supplier[] = [
    {
      id: "1",
      name: "Global Electronics Inc.",
      rating: 4.8,
      deliveryTime: 7,
      reliability: 95,
      lastOrderDate: "2023-05-15",
    },
    {
      id: "2",
      name: "Textile Manufacturers Co.",
      rating: 4.2,
      deliveryTime: 14,
      reliability: 85,
      lastOrderDate: "2023-05-10",
    },
    {
      id: "3",
      name: "Accessories Direct",
      rating: 4.5,
      deliveryTime: 5,
      reliability: 90,
      lastOrderDate: "2023-05-18",
    },
    {
      id: "4",
      name: "Packaging Solutions Ltd.",
      rating: 4.0,
      deliveryTime: 3,
      reliability: 88,
      lastOrderDate: "2023-05-20",
    },
  ];

  // Mock EOQ data
  const eoqData: EOQData[] = [
    {
      itemId: "1",
      itemName: "Wireless Earbuds Pro",
      annualDemand: 1200,
      orderingCost: 50,
      holdingCost: 2.5,
      eoq: 219,
      optimalOrderFrequency: 5.48,
    },
    {
      itemId: "2",
      itemName: "Smart Watch Series 5",
      annualDemand: 800,
      orderingCost: 60,
      holdingCost: 3.2,
      eoq: 173,
      optimalOrderFrequency: 4.62,
    },
    {
      itemId: "3",
      itemName: "Bluetooth Speaker",
      annualDemand: 1500,
      orderingCost: 45,
      holdingCost: 1.8,
      eoq: 274,
      optimalOrderFrequency: 5.47,
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

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
                  <Warehouse className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-sky-800 bg-clip-text text-transparent">
                    SCM Analytics
                  </h1>
                  <p className="text-blue-800/80 text-lg mt-1">
                    Supply chain insights and inventory optimization
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="appearance-none bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="12m">Last 12 months</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4 pointer-events-none" />
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

          {/* Last Updated */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-blue-600/70">
              <Clock className="w-4 h-4 mr-2" />
              clock
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-blue-200 mb-8 w-fit">
          {[
            { key: "overview", label: "Overview", icon: BarChart2 },
            { key: "inventory", label: "Inventory", icon: Package },
            { key: "suppliers", label: "Suppliers", icon: Truck },
            { key: "orders", label: "Orders", icon: ClipboardList },
            { key: "analytics", label: "Analytics", icon: Layers },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md"
                  : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-6">
                <MetricCard
                  title="Inventory Value"
                  value="$287,500"
                  change={5.5}
                  icon={<Box className="w-6 h-6 text-white" />}
                  trend="up"
                />
                <MetricCard
                  title="Stockouts"
                  value="12"
                  change={-8.2}
                  icon={<AlertTriangle className="w-6 h-6 text-white" />}
                  trend="down"
                />
                <MetricCard
                  title="Avg. Lead Time"
                  value="9.2 days"
                  change={-3.7}
                  icon={<Clock4 className="w-6 h-6 text-white" />}
                  trend="down"
                />
                <MetricCard
                  title="Order Accuracy"
                  value="98.7%"
                  change={1.1}
                  icon={<CheckCircle className="w-6 h-6 text-white" />}
                  trend="up"
                />
              </div>

              {/* Inventory Health */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">
                      Inventory Health
                    </h3>
                    <p className="text-sm text-blue-600/70 mt-1">
                      Current stock levels and status
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="h-80 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center">
                  <BarChart2 className="w-16 h-16 text-blue-300" />
                  <span className="ml-2 text-blue-400">
                    Inventory health visualization
                  </span>
                </div>
              </Card>

              {/* EOQ Recommendations & Low Stock Items */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        EOQ Recommendations
                      </h3>
                      <p className="text-sm text-blue-600/70 mt-1">
                        Optimal order quantities
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {eoqData.map((item, index) => (
                      <div
                        key={item.itemId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">
                              {item.itemName}
                            </div>
                            <div className="text-xs text-blue-600/70">
                              Annual demand: {item.annualDemand}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-blue-900">
                            {item.eoq} units
                          </span>
                          <Badge variant="info">
                            {item.optimalOrderFrequency}x/year
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        Low Stock Items
                      </h3>
                      <p className="text-sm text-blue-600/70 mt-1">
                        Items needing reorder
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {inventoryData
                      .filter((item) => item.status !== "good")
                      .map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div>
                              <div className="font-medium text-blue-900">
                                {item.name}
                              </div>
                              <div className="text-xs text-blue-600/70">
                                Current: {item.currentStock}, Reorder at:{" "}
                                {item.reorderPoint}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-blue-900">
                              {item.leadTime} days
                            </span>
                            <Badge
                              variant={
                                item.status === "low"
                                  ? "warning"
                                  : item.status === "critical"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Inventory Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard
                  title="Total SKUs"
                  value="1,245"
                  change={4.5}
                  icon={<Package className="w-6 h-6 text-white" />}
                  trend="up"
                />
                <MetricCard
                  title="Inventory Turnover"
                  value="5.2x"
                  change={0.7}
                  icon={<RefreshCw className="w-6 h-6 text-white" />}
                  trend="up"
                />
                <MetricCard
                  title="Carrying Cost"
                  value="18.5%"
                  change={-1.2}
                  icon={<DollarSign className="w-6 h-6 text-white" />}
                  trend="down"
                />
              </div>

              {/* EOQ Calculator */}
              <div className="grid md:grid-cols-2 gap-6">
                <EOQCalculator />
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        ABC Analysis
                      </h3>
                      <p className="text-sm text-blue-600/70 mt-1">
                        Inventory classification by value
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="h-64 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-blue-300" />
                    <span className="ml-2 text-blue-400">
                      ABC analysis visualization
                    </span>
                  </div>
                </Card>
              </div>

              {/* Inventory Table */}
              <Card>
                <div className="p-6 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900">
                    Inventory Items
                  </h3>
                  <p className="text-sm text-blue-600/70 mt-1">
                    Complete inventory listing
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
                          Category
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Current Stock
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Reorder Point
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Lead Time
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Status
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
                            <div className="font-semibold text-blue-900">
                              {item.name}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-blue-700">
                              {item.category}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              {item.currentStock}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              {item.reorderPoint}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              {item.leadTime} days
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                item.status === "good"
                                  ? "success"
                                  : item.status === "low"
                                  ? "warning"
                                  : item.status === "critical"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="capitalize"
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
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

          {activeTab === "suppliers" && (
            <motion.div
              key="suppliers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Supplier Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard
                  title="Active Suppliers"
                  value="24"
                  change={2.5}
                  icon={<Truck className="w-6 h-6 text-white" />}
                  trend="up"
                />
                <MetricCard
                  title="Avg. Delivery Time"
                  value="6.8 days"
                  change={-1.2}
                  icon={<Clock4 className="w-6 h-6 text-white" />}
                  trend="down"
                />
                <MetricCard
                  title="Avg. Supplier Rating"
                  value="4.5/5"
                  change={0.3}
                  icon={<CheckCircle className="w-6 h-6 text-white" />}
                  trend="up"
                />
              </div>

              {/* Supplier Performance */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">
                      Supplier Performance
                    </h3>
                    <p className="text-sm text-blue-600/70 mt-1">
                      Key metrics by supplier
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="h-80 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center">
                  <BarChart2 className="w-16 h-16 text-blue-300" />
                  <span className="ml-2 text-blue-400">
                    Supplier performance visualization
                  </span>
                </div>
              </Card>

              {/* Supplier Table */}
              <Card>
                <div className="p-6 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900">
                    Supplier Directory
                  </h3>
                  <p className="text-sm text-blue-600/70 mt-1">
                    Complete supplier listing
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Supplier
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Rating
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Avg. Delivery
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Reliability
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Last Order
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierData.map((supplier, index) => (
                        <motion.tr
                          key={supplier.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-blue-100/50 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-semibold text-blue-900">
                              {supplier.name}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(supplier.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-sm text-blue-700">
                                {supplier.rating}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              {supplier.deliveryTime} days
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="w-full bg-blue-100 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-500"
                                style={{ width: `${supplier.reliability}%` }}
                              />
                            </div>
                            <span className="text-xs text-blue-700">
                              {supplier.reliability}%
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              {supplier.lastOrderDate}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
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

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Order Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard
                  title="Open POs"
                  value="42"
                  change={-5.5}
                  icon={<ClipboardList className="w-6 h-6 text-white" />}
                  trend="down"
                />
                <MetricCard
                  title="Avg. Order Cycle"
                  value="4.2 days"
                  change={-1.8}
                  icon={<Clock4 className="w-6 h-6 text-white" />}
                  trend="down"
                />
                <MetricCard
                  title="Order Accuracy"
                  value="98.7%"
                  change={0.7}
                  icon={<CheckCircle className="w-6 h-6 text-white" />}
                  trend="up"
                />
              </div>

              {/* Order Trends */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">
                      Order Trends
                    </h3>
                    <p className="text-sm text-blue-600/70 mt-1">
                      Monthly purchase order volume
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="h-80 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center">
                  <LineChart className="w-16 h-16 text-blue-300" />
                  <span className="ml-2 text-blue-400">
                    Order trends visualization
                  </span>
                </div>
              </Card>

              {/* Recent Orders */}
              <Card>
                <div className="p-6 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900">
                    Recent Purchase Orders
                  </h3>
                  <p className="text-sm text-blue-600/70 mt-1">
                    Last 20 purchase orders
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          PO Number
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Supplier
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Date
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Items
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Total Value
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-blue-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "PO-2023-0456",
                          supplier: "Global Electronics Inc.",
                          date: "2023-05-18",
                          items: 12,
                          value: 12500,
                          status: "Delivered",
                        },
                        {
                          id: "PO-2023-0455",
                          supplier: "Textile Manufacturers Co.",
                          date: "2023-05-15",
                          items: 8,
                          value: 8760,
                          status: "In Transit",
                        },
                        {
                          id: "PO-2023-0454",
                          supplier: "Accessories Direct",
                          date: "2023-05-12",
                          items: 5,
                          value: 5420,
                          status: "Processing",
                        },
                        {
                          id: "PO-2023-0453",
                          supplier: "Packaging Solutions Ltd.",
                          date: "2023-05-10",
                          items: 3,
                          value: 3200,
                          status: "Delivered",
                        },
                      ].map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-blue-100/50 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-semibold text-blue-900">
                              {order.id}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-blue-700">
                              {order.supplier}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              {order.date}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              {order.items}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-900">
                              ${order.value.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                order.status === "Delivered"
                                  ? "success"
                                  : order.status === "In Transit"
                                  ? "info"
                                  : "warning"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
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

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Analytics Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard
                  title="Forecast Accuracy"
                  value="92.5%"
                  change={3.2}
                  icon={<TrendingUp className="w-6 h-6 text-white" />}
                  trend="up"
                />
                <MetricCard
                  title="Carrying Cost"
                  value="18.5%"
                  change={-1.2}
                  icon={<DollarSign className="w-6 h-6 text-white" />}
                  trend="down"
                />
                <MetricCard
                  title="Stockout Rate"
                  value="2.3%"
                  change={-0.8}
                  icon={<AlertTriangle className="w-6 h-6 text-white" />}
                  trend="down"
                />
              </div>

              {/* Demand Forecasting */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">
                      Demand Forecasting
                    </h3>
                    <p className="text-sm text-blue-600/70 mt-1">
                      Projected vs actual demand
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="h-80 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center">
                  <LineChart className="w-16 h-16 text-blue-300" />
                  <span className="ml-2 text-blue-400">
                    Demand forecasting visualization
                  </span>
                </div>
              </Card>

              {/* Inventory Optimization */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        Safety Stock Analysis
                      </h3>
                      <p className="text-sm text-blue-600/70 mt-1">
                        Recommended safety stock levels
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        item: "Wireless Earbuds Pro",
                        currentSS: 45,
                        recommendedSS: 52,
                        variability: "High",
                      },
                      {
                        item: "Smart Watch Series 5",
                        currentSS: 30,
                        recommendedSS: 38,
                        variability: "Medium",
                      },
                      {
                        item: "Bluetooth Speaker",
                        currentSS: 20,
                        recommendedSS: 25,
                        variability: "Low",
                      },
                      {
                        item: "Organic Cotton T-Shirt",
                        currentSS: 60,
                        recommendedSS: 55,
                        variability: "Medium",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">
                              {item.item}
                            </div>
                            <div className="text-xs text-blue-600/70">
                              Variability: {item.variability}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-blue-900">
                            {item.currentSS} → {item.recommendedSS}
                          </span>
                          <Badge
                            variant={
                              item.recommendedSS > item.currentSS
                                ? "destructive"
                                : "success"
                            }
                          >
                            {item.recommendedSS > item.currentSS
                              ? "Increase"
                              : "Decrease"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        Lead Time Analysis
                      </h3>
                      <p className="text-sm text-blue-600/70 mt-1">
                        Supplier lead time variability
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="h-64 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center">
                    <BarChart2 className="w-16 h-16 text-blue-300" />
                    <span className="ml-2 text-blue-400">
                      Lead time analysis visualization
                    </span>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
