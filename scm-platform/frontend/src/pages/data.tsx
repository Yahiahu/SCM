import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Package,
  Users,
  Warehouse,
  ShoppingCart,
  Building,
  UserCheck,
  Database,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
  RefreshCw,
  FileText,
  Calendar,
  TrendingUp,
  Activity,
  Zap,
  Target,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Type definitions
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
    | "premium";
  className?: string;
};

type TableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
};

type EntityData = {
  id: string;
  [key: string]: any;
};

type Entity = {
  key: string;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
  count: number;
  lastUpdated: string;
  status: "active" | "syncing" | "error";
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

// Mock data
const entities: Entity[] = [
  {
    key: "Organization",
    name: "Organizations",
    description: "Company details",
    color: "from-blue-600 to-sky-600",
    icon: Building,
    count: 1,
    lastUpdated: "2 hours ago",
    status: "active",
  },
  {
    key: "Supplier",
    name: "Suppliers",
    description: "Vendor information",
    color: "from-blue-500 to-indigo-500",
    icon: Users,
    count: 24,
    lastUpdated: "1 hour ago",
    status: "active",
  },
  {
    key: "Product",
    name: "Products",
    description: "Items you sell",
    color: "from-sky-500 to-blue-500",
    icon: Package,
    count: 156,
    lastUpdated: "30 minutes ago",
    status: "syncing",
  },
  {
    key: "Component",
    name: "Components",
    description: "Parts & materials",
    color: "from-indigo-500 to-blue-500",
    icon: Package,
    count: 89,
    lastUpdated: "45 minutes ago",
    status: "active",
  },
  {
    key: "Warehouse",
    name: "Warehouses",
    description: "Storage locations",
    color: "from-blue-600 to-cyan-500",
    icon: Warehouse,
    count: 5,
    lastUpdated: "3 hours ago",
    status: "active",
  },
  {
    key: "PurchaseOrder",
    name: "Purchase Orders",
    description: "Procurement records",
    color: "from-blue-500 to-indigo-500",
    icon: ShoppingCart,
    count: 42,
    lastUpdated: "15 minutes ago",
    status: "active",
  },
];

const sampleTableColumns: TableColumn[] = [
  { key: "name", label: "Name", sortable: true, width: "w-1/4" },
  { key: "email", label: "Email", sortable: true, width: "w-1/4" },
  { key: "status", label: "Status", sortable: true, width: "w-1/6" },
  { key: "lastUpdated", label: "Last Updated", sortable: true, width: "w-1/6" },
  { key: "actions", label: "Actions", width: "w-1/6" },
];

const sampleData: EntityData[] = [
  {
    id: "1",
    name: "Acme Corp",
    email: "contact@acme.com",
    status: "Active",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "TechFlow Inc",
    email: "info@techflow.com",
    status: "Active",
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    name: "Global Systems",
    email: "support@globalsys.com",
    status: "Inactive",
    lastUpdated: "3 days ago",
  },
];

export default function DataManagement() {
  const [selectedEntity, setSelectedEntity] = useState<string>("Supplier");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentData, setCurrentData] = useState<EntityData[]>(sampleData);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const selectedEntityData = entities.find((e) => e.key === selectedEntity);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentData.map((item) => item.id));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setCurrentData((prev) => prev.filter((item) => item.id !== itemToDelete));
      setItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleBulkDelete = () => {
    setCurrentData((prev) =>
      prev.filter((item) => !selectedRows.includes(item.id))
    );
    setSelectedRows([]);
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-emerald-600 bg-emerald-100";
      case "inactive":
        return "text-red-600 bg-red-100";
      case "syncing":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getEntityStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-600";
      case "syncing":
        return "text-blue-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 overflow-x-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-sky-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-4 rounded-2xl shadow-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-sky-800 bg-clip-text text-transparent">
                  Data Management
                </h1>
                <p className="text-blue-800/80 text-lg">
                  View and manage your supply chain data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="secondary">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </motion.div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700/80 text-sm font-medium">
                  Total Records
                </p>
                <p className="text-3xl font-bold text-blue-900">1,247</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">+12%</span>
              <span className="text-blue-700/70 ml-1">this month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700/80 text-sm font-medium">
                  Active Entities
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {entities.filter((e) => e.status === "active").length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Activity className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Check className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">
                All systems operational
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700/80 text-sm font-medium">
                  Last Sync
                </p>
                <p className="text-3xl font-bold text-blue-900">15m</p>
              </div>
              <div className="p-3 bg-sky-100 rounded-xl">
                <RefreshCw className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Zap className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-blue-600 font-medium">
                Auto-sync enabled
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700/80 text-sm font-medium">
                  Data Quality
                </p>
                <p className="text-3xl font-bold text-blue-900">98%</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Check className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">Excellent</span>
            </div>
          </Card>
        </div>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Entity Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-bold text-blue-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Entities
              </h2>

              <div className="space-y-3">
                {entities.map((entity) => {
                  const Icon = entity.icon;
                  const isSelected = selectedEntity === entity.key;

                  return (
                    <motion.div
                      key={entity.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "border-blue-500 bg-gradient-to-r from-blue-100 to-sky-100 shadow-lg"
                          : "border-blue-200 hover:border-blue-300 bg-white/80 hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedEntity(entity.key)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected ? "bg-white/20" : "bg-blue-100"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                isSelected ? "text-blue-600" : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div
                              className={`font-semibold text-sm ${
                                isSelected ? "text-blue-900" : "text-blue-900"
                              }`}
                            >
                              {entity.name}
                            </div>
                            <div
                              className={`text-xs ${
                                isSelected
                                  ? "text-blue-700"
                                  : "text-blue-700/80"
                              }`}
                            >
                              {entity.description}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <span className="text-blue-700 font-medium">
                            {entity.count} records
                          </span>
                          <div
                            className={`flex items-center ${getEntityStatusColor(
                              entity.status
                            )}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-1 ${
                                entity.status === "active"
                                  ? "bg-emerald-500"
                                  : entity.status === "syncing"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="capitalize">{entity.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-blue-600/80 mt-2">
                        Updated {entity.lastUpdated}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
          {/* Main Data Table */}
          <div className="lg:col-span-3 space-y-6">
            {/* Controls */}
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${
                      selectedEntityData?.color || "from-blue-500 to-sky-500"
                    }`}
                  >
                    {selectedEntityData && (
                      <selectedEntityData.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">
                      {selectedEntityData?.name || "Select Entity"}
                    </h3>
                    <p className="text-blue-700/80">
                      {selectedEntityData?.count || 0} records •{" "}
                      {selectedEntityData?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white/80 backdrop-blur-sm text-blue-900 placeholder-blue-400"
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>

                  <Button variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-blue-200"
                  >
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Status
                        </label>
                        <select className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white/80">
                          <option>All Statuses</option>
                          <option>Active</option>
                          <option>Inactive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Date Range
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                          <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white/80"
                          />
                        </div>
                      </div>

                      <div className="flex items-end">
                        <Button variant="outline" className="w-full">
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="premium">
                      {selectedRows.length} selected
                    </Badge>
                    <span className="text-blue-700">
                      Bulk actions available
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Data Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-200">
                    <tr>
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedRows.length === currentData.length &&
                            currentData.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      {sampleTableColumns.map((column) => (
                        <th
                          key={column.key}
                          className={`p-4 text-left text-blue-900 font-semibold ${
                            column.width || ""
                          }`}
                        >
                          {column.sortable ? (
                            <button
                              onClick={() => handleSort(column.key)}
                              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                            >
                              <span>{column.label}</span>
                              <ArrowUpDown className="w-4 h-4" />
                            </button>
                          ) : (
                            column.label
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-blue-100 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => handleSelectRow(item.id)}
                            className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-4 font-medium text-blue-900">
                          {item.name}
                        </td>
                        <td className="p-4 text-blue-700">{item.email}</td>
                        <td className="p-4">
                          <Badge
                            className={`${getStatusColor(
                              item.status
                            )} border-0`}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-blue-600 text-sm">
                          {item.lastUpdated}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-blue-200"
                >
                  <div className="flex items-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                    <h3 className="text-lg font-bold text-blue-900">
                      Confirm Delete
                    </h3>
                  </div>
                  <p className="text-blue-800 mb-6">
                    Are you sure you want to delete this record? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>{" "}
          {/* End Main Data Table col-span-3 */}
        </div>{" "}
        {/* End grid */}
      </div>{" "}
      {/* End container */}
    </div>
  );
}
