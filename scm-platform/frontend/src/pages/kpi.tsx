import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Eye,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
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
    | "premium";
  className?: string;
};

type KPICardProps = {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: "up" | "down" | "neutral";
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
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

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  trend = "neutral",
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-4 h-4" />;
      case "down":
        return <ArrowDownRight className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-600 bg-emerald-100";
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <Card className="overflow-hidden group hover:scale-105 transition-all duration-300">
      <div className={`h-1 bg-gradient-to-r ${color}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-r ${color} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}
          >
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-blue-700/80 uppercase tracking-wide">
            {title}
          </h3>
          <div className="text-3xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
            {value}
          </div>
          <p className="text-sm text-blue-600/70">{changeLabel}</p>
        </div>
      </div>
    </Card>
  );
};

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => (
  <Card className={`overflow-hidden ${className}`}>
    <div className="p-6 border-b border-blue-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-blue-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-blue-600/70 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </Card>
);

export default function KPIDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$2.4M",
      change: 12.5,
      changeLabel: "vs last month",
      icon: DollarSign,
      color: "from-blue-600 to-sky-600",
      trend: "up" as const,
    },
    {
      title: "Orders Processed",
      value: "1,847",
      change: -3.2,
      changeLabel: "vs last week",
      icon: Package,
      color: "from-sky-500 to-blue-500",
      trend: "down" as const,
    },
    {
      title: "Active Suppliers",
      value: "247",
      change: 8.1,
      changeLabel: "new this month",
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      trend: "up" as const,
    },
    {
      title: "Delivery Performance",
      value: "94.2%",
      change: 0.8,
      changeLabel: "on-time delivery",
      icon: Truck,
      color: "from-indigo-500 to-blue-500",
      trend: "neutral" as const,
    },
    {
      title: "Inventory Turnover",
      value: "6.8x",
      change: 15.3,
      changeLabel: "improved efficiency",
      icon: Activity,
      color: "from-emerald-500 to-blue-500",
      trend: "up" as const,
    },
    {
      title: "Cost Savings",
      value: "$847K",
      change: 22.7,
      changeLabel: "optimization gains",
      icon: Target,
      color: "from-blue-600 to-cyan-500",
      trend: "up" as const,
    },
  ];

  const periods = [
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ];

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
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-sky-800 bg-clip-text text-transparent">
                    KPI Dashboard
                  </h1>
                  <p className="text-blue-800/80 text-lg mt-1">
                    Real-time insights into your supply chain performance
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Period Selector */}
              <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-blue-200">
                {periods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPeriod === period.value
                        ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md"
                        : "text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

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
          <div className="flex items-center text-sm text-blue-600/70 mt-4">
            <Clock className="w-4 h-4 mr-2" />
            now
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <KPICard {...kpi} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ChartCard
            title="Revenue Trend"
            subtitle="Monthly performance over time"
          >
            <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <div className="text-center space-y-3">
                <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-3 rounded-xl w-fit mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-blue-700 font-medium">Revenue Chart</p>
                <p className="text-blue-600/70 text-sm">
                  Interactive chart would be displayed here
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Order Distribution"
            subtitle="By category and status"
          >
            <div className="h-64 flex items-center justify-center bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl">
              <div className="text-center space-y-3">
                <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-3 rounded-xl w-fit mx-auto">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <p className="text-blue-700 font-medium">Distribution Chart</p>
                <p className="text-blue-600/70 text-sm">
                  Pie chart visualization would be displayed here
                </p>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Badge variant="success">Healthy</Badge>
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                System Status
              </h3>
              <p className="text-blue-600/70">All systems operational</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Uptime</span>
                  <span className="font-semibold text-emerald-600">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Response Time</span>
                  <span className="font-semibold text-emerald-600">120ms</span>
                </div>
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
                <Badge variant="warning">Attention</Badge>
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Alerts</h3>
              <p className="text-blue-600/70">3 items need attention</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Low Stock</span>
                  <span className="font-semibold text-amber-600">2 items</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Delayed Orders</span>
                  <span className="font-semibold text-amber-600">1 order</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <Badge variant="premium">Active</Badge>
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Automation
              </h3>
              <p className="text-blue-600/70">24 processes automated</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Time Saved</span>
                  <span className="font-semibold text-blue-600">
                    8.5 hrs/day
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Efficiency</span>
                  <span className="font-semibold text-blue-600">+32%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start">
                <Calendar className="w-4 h-4 mr-3" />
                Schedule Report
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="w-4 h-4 mr-3" />
                Export Data
              </Button>
              <Button variant="outline" className="justify-start">
                <Target className="w-4 h-4 mr-3" />
                Set Goals
              </Button>
              <Button variant="gradient" className="justify-start">
                <Eye className="w-4 h-4 mr-3" />
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
