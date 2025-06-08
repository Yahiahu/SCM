import { motion } from "framer-motion";
import { FaTruck, FaWarehouse, FaChartLine } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import MetricCard from "./MetricCard";

const KeyMetrics = () => {
  const metrics = [
    {
      icon: <MdInventory className="w-6 h-6 text-sky-600" />,
      iconBg: "bg-sky-100/50",
      iconBorder: "border-sky-200/50",
      title: "Total Inventory",
      value: "1,248",
      unit: "items",
      trend: "↑ 12%",
      trendColor: "bg-green-100 text-green-700",
    },
    {
      icon: <FaTruck className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100/50",
      iconBorder: "border-blue-200/50",
      title: "Active Shipments",
      value: "17",
      unit: "in transit",
      trend: "↓ 3 delayed",
      trendColor: "bg-red-100 text-red-700",
    },
    {
      icon: <FaChartLine className="w-6 h-6 text-amber-600" />,
      iconBg: "bg-amber-100/50",
      iconBorder: "border-amber-200/50",
      title: "Order Accuracy",
      value: "98.7%",
      unit: "accuracy",
      trend: "↑ 1.2%",
      trendColor: "bg-green-100 text-green-700",
    },
    {
      icon: <FaWarehouse className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-100/50",
      iconBorder: "border-purple-200/50",
      title: "Warehouse Capacity",
      value: "78%",
      unit: "22% available",
      trend: "", // optional fallback if needed
      trendColor: "", // optional fallback if needed
      isProgress: true, // this was the key addition
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </motion.div>
  );
};

export default KeyMetrics;
