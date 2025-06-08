import { motion } from "framer-motion";
import { FaExchangeAlt, FaArrowRight } from "react-icons/fa";
import GradientButton from "./GradientButton";

const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100/50 border border-amber-200/50">
            <FaExchangeAlt className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
        </div>
        <GradientButton
          icon={<FaArrowRight className="w-3 h-3" />}
          size={undefined}
        >
          View All
        </GradientButton>
      </div>

      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
          <p className="font-medium text-gray-800">Inventory Update</p>
          <p className="text-sm text-gray-600">
            SKU-1002 quantity updated to 89
          </p>
          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
        </div>

        <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
          <p className="font-medium text-gray-800">Shipment Delayed</p>
          <p className="text-sm text-gray-600">SH-1002 delayed by 2 days</p>
          <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
        </div>

        <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
          <p className="font-medium text-gray-800">New Order</p>
          <p className="text-sm text-gray-600">
            Order #45678 placed for Retail Store
          </p>
          <p className="text-xs text-gray-400 mt-1">1 day ago</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivity;
