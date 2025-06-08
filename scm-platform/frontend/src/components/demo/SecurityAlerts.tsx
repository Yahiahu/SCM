import { motion } from "framer-motion";
import { MdOutlineSecurity } from "react-icons/md";

const SecurityAlerts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-white/80 backdrop-blur-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100/50 border border-blue-200/50">
          <MdOutlineSecurity className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Security Alerts</h2>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-green-100/80 text-green-800 text-sm font-medium">
          Secure
        </span>
        <p className="text-sm text-gray-600">All systems operating normally</p>
      </div>
    </motion.div>
  );
};

export default SecurityAlerts;
