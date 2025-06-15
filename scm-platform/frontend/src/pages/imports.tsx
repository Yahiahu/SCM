import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Package,
  Users,
  Warehouse,
  ShoppingCart,
  Building,
  UserCheck,
  Check,
  AlertCircle,
  ArrowRight,
  Zap,
  Sparkles,
  Target,
  Database,
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

type ProgressProps = {
  value?: number;
  className?: string;
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

type AlertProps = {
  children: React.ReactNode;
  className?: string;
};

type EntityGroup = {
  title: string;
  entities: Entity[];
};

type Entity = {
  key: string;
  name: string;
  description: string;
  color: string;
};

// Enhanced components with About Us page styling
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

const Progress: React.FC<ProgressProps> = ({ value = 0, className = "" }) => (
  <div
    className={`relative h-3 w-full overflow-hidden rounded-full bg-blue-100/50 backdrop-blur-sm ${className}`}
  >
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-500 ease-out rounded-full shadow-sm"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
  </div>
);

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

const Alert: React.FC<AlertProps> = ({ children, className = "" }) => (
  <div
    className={`relative w-full rounded-2xl border-2 p-6 bg-gradient-to-r from-blue-50 to-sky-50 text-blue-800 border-blue-200 shadow-lg ${className}`}
  >
    {children}
  </div>
);

// Entity definitions with colors
const entityFields: Record<string, string[]> = {
  Organization: ["name", "address", "phone", "email", "taxId"],
  Supplier: [
    "name",
    "contactPerson",
    "email",
    "phone",
    "address",
    "paymentTerms",
  ],
  Product: ["name", "sku", "description", "category", "price", "weight"],
  Component: [
    "name",
    "partNumber",
    "description",
    "category",
    "unitCost",
    "supplier",
  ],
  Warehouse: ["name", "address", "capacity", "type", "managerId"],
  WarehouseInventory: [
    "productId",
    "warehouseId",
    "quantity",
    "location",
    "lastUpdated",
  ],
  PurchaseOrder: [
    "orderNumber",
    "supplierId",
    "orderDate",
    "expectedDate",
    "status",
    "total",
  ],
  User: ["firstName", "lastName", "email", "role", "department", "phone"],
};

const entityIcons: Record<string, React.ComponentType<any>> = {
  Organization: Building,
  Supplier: Users,
  Product: Package,
  Component: Package,
  Warehouse: Warehouse,
  WarehouseInventory: Database,
  PurchaseOrder: ShoppingCart,
  User: UserCheck,
};

const entityGroups: EntityGroup[] = [
  {
    title: "Core Entities",
    entities: [
      {
        key: "Organization",
        name: "Organization",
        description: "Your company details",
        color: "from-blue-600 to-sky-600",
      },
      {
        key: "Supplier",
        name: "Suppliers",
        description: "Vendor information",
        color: "from-blue-500 to-indigo-500",
      },
      {
        key: "Product",
        name: "Products",
        description: "Items you sell",
        color: "from-sky-500 to-blue-500",
      },
      {
        key: "Component",
        name: "Components",
        description: "Parts & materials",
        color: "from-indigo-500 to-blue-500",
      },
    ],
  },
  {
    title: "Inventory",
    entities: [
      {
        key: "Warehouse",
        name: "Warehouses",
        description: "Storage locations",
        color: "from-blue-600 to-cyan-500",
      },
      {
        key: "WarehouseInventory",
        name: "Inventory",
        description: "Stock levels",
        color: "from-sky-500 to-blue-500",
      },
    ],
  },
  {
    title: "Operations",
    entities: [
      {
        key: "PurchaseOrder",
        name: "Purchase Orders",
        description: "Procurement records",
        color: "from-blue-500 to-indigo-500",
      },
      {
        key: "User",
        name: "Users",
        description: "Team members",
        color: "from-indigo-500 to-blue-500",
      },
    ],
  },
];

export default function SupplyChainSetup() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>(
    {}
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    setTimeout(() => {
      const mockColumns = [
        "Name",
        "Email",
        "Phone",
        "Address",
        "Category",
        "Price",
        "SKU",
        "Description",
        "Quantity",
        "Date",
        "ContactPerson",
        "PaymentTerms",
        "PartNumber",
        "UnitCost",
      ];
      setFileColumns(mockColumns);
    }, 500);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload]
  );

  const handleEntitySelect = (entityKey: string) => {
    setSelectedEntity(entityKey);
    setFieldMappings({});
  };

  const handleColumnDrop = (field: string, column: string) => {
    setFieldMappings((prev) => ({
      ...prev,
      [field]: column,
    }));
  };

  const removeMapping = (field: string) => {
    setFieldMappings((prev) => {
      const newMappings = { ...prev };
      delete newMappings[field];
      return newMappings;
    });
  };

  const canProcess = () => {
    if (!selectedEntity || fileColumns.length === 0) return false;
    const requiredFields = entityFields[selectedEntity].slice(0, 3);
    return requiredFields.every((field) => fieldMappings[field]);
  };

  const processData = async () => {
    if (!canProcess()) return;

    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    setIsProcessing(false);
    setIsComplete(true);

    setTimeout(() => {
      setSelectedEntity(null);
      setFileColumns([]);
      setFieldMappings({});
      setProgress(0);
      setIsComplete(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 3000);
  };

  const getSelectedEntityColor = () => {
    if (!selectedEntity) return "from-blue-500 to-sky-500";
    for (const group of entityGroups) {
      const entity = group.entities.find((e) => e.key === selectedEntity);
      if (entity) return entity.color;
    }
    return "from-blue-500 to-sky-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 overflow-x-hidden relative pt-20">
        <Navbar isLoggedIn={true}/>
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
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-4 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 to-sky-800 bg-clip-text text-transparent mb-4">
            Quick Setup Wizard
          </h1>
          <p className="text-xl text-blue-800/80 max-w-2xl mx-auto leading-relaxed">
            Transform your data into a powerful supply chain system in minutes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center mb-6">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-bold text-blue-900">
                  Select Entity
                </h2>
              </div>

              {entityGroups.map((group) => (
                <div key={group.title} className="mb-8">
                  <h3 className="text-sm font-bold text-blue-700/80 uppercase tracking-wider mb-4 flex items-center">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent mr-3"></div>
                    {group.title}
                  </h3>
                  <div className="space-y-3">
                    {group.entities.map((entity) => {
                      const Icon = entityIcons[entity.key];
                      const isSelected = selectedEntity === entity.key;
                      return (
                        <motion.div
                          key={entity.key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            isSelected
                              ? "border-blue-500 bg-gradient-to-r from-blue-100 to-sky-100 text-white scale-105"
                              : "border-blue-300 hover:border-blue-300 bg-white/80 hover:bg-blue-50"
                          }`}
                          style={{
                            backgroundImage: isSelected
                              ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                              : undefined,
                          }}
                          onClick={() => handleEntitySelect(entity.key)}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected
                                  ? "bg-white/20"
                                  : "bg-blue-100 group-hover:bg-blue-200"
                              } transition-colors duration-200`}
                            >
                              <Icon
                                className={`w-5 h-5 ${
                                  isSelected ? "text-blue-500" : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-semibold text-sm ${
                                  isSelected ? "text-blue-500" : "text-blue-900"
                                }`}
                              >
                                {entity.name}
                              </div>
                              <div
                                className={`text-xs mt-1 ${
                                  isSelected
                                    ? "text-blue-900"
                                    : "text-blue-700/80"
                                }`}
                              >
                                {entity.description}
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Enhanced File Upload Zone */}
            <Card className="overflow-hidden">
              <div className="p-8">
                <div
                  className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 group cursor-pointer ${
                    fileColumns.length > 0
                      ? "border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50"
                      : "border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50/50 to-sky-50/50 hover:from-blue-100/30 hover:to-sky-100/30"
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-6">
                    <div
                      className={`mx-auto p-4 rounded-2xl ${
                        fileColumns.length > 0
                          ? "bg-sky-500"
                          : "bg-gradient-to-r from-blue-500 to-sky-500 group-hover:from-blue-600 group-hover:to-sky-600"
                      } transition-all duration-300 w-fit`}
                    >
                      {fileColumns.length > 0 ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : (
                        <Upload className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-3">
                        {fileColumns.length > 0
                          ? "File Loaded!"
                          : "Upload Your Data"}
                      </h3>
                      <p className="text-blue-800/80 mb-6 text-lg">
                        {fileColumns.length > 0
                          ? `Found ${fileColumns.length} columns ready for mapping`
                          : "Drop your CSV or Excel files here to get started"}
                      </p>
                      {fileColumns.length === 0 && (
                        <Button variant="gradient" size="lg">
                          <FileText className="w-5 h-5 mr-3" />
                          Choose Files
                        </Button>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx"
                    multiple
                    onChange={(e) =>
                      handleFileUpload(Array.from(e.target.files || []))
                    }
                  />
                </div>

                {selectedEntity && (
                  <div className="mt-6 flex items-center justify-center">
                    <Badge className="text-sm px-4 py-2">
                      <Zap className="w-4 h-4 mr-2" />
                      {selectedEntity} Selected
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Mapping Section */}
            {selectedEntity && fileColumns.length > 0 && (
              <Card className="overflow-hidden">
                <div
                  className={`h-2 bg-gradient-to-r ${getSelectedEntityColor()}`}
                ></div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${getSelectedEntityColor()}`}
                      >
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-blue-900">
                          Map Your Data
                        </h3>
                        <p className="text-blue-800/80">
                          Drag columns to their corresponding fields
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-sm px-4 py-2 border-2 border-blue-200"
                    >
                      {selectedEntity}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Enhanced File Columns */}
                    <div>
                      <h4 className="font-bold text-blue-900 mb-6 flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                        File Columns ({fileColumns.length})
                      </h4>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {fileColumns.map((column) => (
                          <motion.div
                            key={column}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition-all duration-200"
                            draggable
                            onDragStart={() => setDraggedColumn(column)}
                            onDragEnd={() => setDraggedColumn(null)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-semibold text-blue-800">
                                {column}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Entity Fields */}
                    <div>
                      <h4 className="font-bold text-blue-900 mb-6 flex items-center">
                        <div
                          className={`w-4 h-4 bg-gradient-to-r ${getSelectedEntityColor()} rounded mr-3`}
                        ></div>
                        {selectedEntity} Fields
                      </h4>
                      <div className="space-y-4">
                        {entityFields[selectedEntity].map((field, index) => {
                          const isRequired = index < 3;
                          const mappedColumn = fieldMappings[field];
                          const isDragOver = dragOverField === field;

                          return (
                            <motion.div
                              key={field}
                              whileHover={{ scale: 1.02 }}
                              className={`p-4 border-3 border-dashed rounded-xl transition-all duration-300 ${
                                isDragOver
                                  ? "border-blue-400 bg-blue-100/50 scale-105 shadow-lg"
                                  : mappedColumn
                                  ? "border-sky-400 bg-gradient-to-r from-sky-50 to-blue-50 shadow-md"
                                  : "border-blue-200 bg-blue-50/30 hover:border-blue-300"
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverField(field);
                              }}
                              onDragLeave={() => setDragOverField(null)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setDragOverField(null);
                                if (draggedColumn) {
                                  handleColumnDrop(field, draggedColumn);
                                }
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={
                                      mappedColumn
                                        ? "w-2 h-2 bg-sky-500 rounded-full"
                                        : "w-2 h-2 bg-blue-400 rounded-full"
                                    }
                                  ></div>
                                  <span className="font-semibold text-blue-800">
                                    {field}
                                  </span>
                                  {isRequired && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                {mappedColumn && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMapping(field)}
                                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>

                              {mappedColumn ? (
                                <div className="flex items-center">
                                  <Check className="w-4 h-4 text-sky-600 mr-3" />
                                  <span className="text-sky-700 font-semibold">
                                    {mappedColumn}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-blue-700/70 italic">
                                  Drop a column here to map
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Process Section */}
                  <div className="mt-10 space-y-6">
                    <Button
                      onClick={processData}
                      disabled={!canProcess() || isProcessing}
                      variant="gradient"
                      size="lg"
                      className="w-full text-lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-3" />
                          Import Data
                        </>
                      )}
                    </Button>

                    {isProcessing && (
                      <div className="space-y-4">
                        <Progress value={progress} />
                        <p className="text-center text-blue-700 font-medium">
                          Processing your data... {progress}%
                        </p>
                      </div>
                    )}

                    {isComplete && (
                      <Alert>
                        <div className="flex items-center">
                          <div className="p-2 bg-sky-500 rounded-full mr-4">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-lg">Success!</span>
                            <p className="text-sky-700 mt-1">
                              Your data has been imported successfully
                            </p>
                          </div>
                        </div>
                      </Alert>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Enhanced Help Text */}
            {!selectedEntity && (
              <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
                <div className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2 text-lg">
                        Ready to Get Started?
                      </h4>
                      <p className="text-blue-700 leading-relaxed">
                        Select an entity from the sidebar to begin importing
                        your data. We recommend starting with core entities like
                        Organization or Suppliers to establish a solid
                        foundation for your supply chain system.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
