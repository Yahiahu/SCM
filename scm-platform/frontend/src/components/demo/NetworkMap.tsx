import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaWarehouse, FaTruck } from "react-icons/fa";
import { GiFactory } from "react-icons/gi";

const NetworkMap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100/50 border border-purple-200/50">
            <FaMapMarkerAlt className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Network Map</h2>
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-100/50 to-blue-100/50 h-48 rounded-xl flex items-center justify-center mb-6 border border-sky-200/30 overflow-hidden">
        <img
          src="https://cdn.britannica.com/37/245037-050-79129D52/world-map-continents-oceans.jpg"
          alt="Network Map"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
          <div className="p-2 rounded-lg bg-orange-100/50 border border-orange-200/50">
            <GiFactory className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">2 Active Factories</p>
            <p className="text-sm text-gray-500">Operating normally</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
          <div className="p-2 rounded-lg bg-blue-100/50 border border-blue-200/50">
            <FaWarehouse className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">3 Warehouses</p>
            <p className="text-sm text-gray-500">78% average capacity</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-sky-200/30">
          <div className="p-2 rounded-lg bg-green-100/50 border border-green-200/50">
            <FaTruck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">17 In-Transit Shipments</p>
            <p className="text-sm text-gray-500">3 delayed</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NetworkMap;
