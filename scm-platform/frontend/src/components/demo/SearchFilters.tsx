import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaMapMarkerAlt } from "react-icons/fa";

const SearchFilters = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 flex flex-wrap items-center gap-4"
    >
      <div className="relative flex-1 min-w-[300px] group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-sky-500 transition-colors">
          <FaSearch className="w-5 h-5" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3 bg-white/80 border border-sky-200/70 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/70 backdrop-blur-sm transition-all shadow-sm"
          placeholder="Search inventory, shipments..."
        />
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <select className="appearance-none w-48 pl-10 pr-8 py-3 bg-white/80 border border-sky-200/70 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/70 backdrop-blur-sm shadow-sm cursor-pointer">
          <option>All Locations</option>
          <option>Warehouse 1</option>
          <option>Warehouse 2</option>
          <option>Factory A</option>
        </select>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-sky-500 transition-colors">
          <FaMapMarkerAlt className="w-5 h-5" />
        </div>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          ▼
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <select className="appearance-none w-48 pl-10 pr-8 py-3 bg-white/80 border border-sky-200/70 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/70 backdrop-blur-sm shadow-sm cursor-pointer">
          <option>All Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-sky-500 transition-colors">
          <FaFilter className="w-5 h-5" />
        </div>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          ▼
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchFilters;
