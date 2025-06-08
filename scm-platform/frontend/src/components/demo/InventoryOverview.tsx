import { motion } from "framer-motion";
import { MdInventory } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import GradientButton from "./GradientButton";
import StatusBadge from "./StatusBadge";

const inventoryItems = [
  {
    id: "SKU-1001",
    name: "Widget A",
    quantity: 245,
    location: "WH-1-A12",
    status: "In Stock",
  },
  {
    id: "SKU-1002",
    name: "Gadget B",
    quantity: 89,
    location: "WH-2-B05",
    status: "Low Stock",
  },
  {
    id: "SKU-1003",
    name: "Component C",
    quantity: 532,
    location: "WH-1-C22",
    status: "In Stock",
  },
  {
    id: "SKU-1004",
    name: "Part D",
    quantity: 0,
    location: "WH-3-D14",
    status: "Out of Stock",
  },
];

const InventoryOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100/50 border border-sky-200/50">
            <MdInventory className="w-6 h-6 text-sky-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Inventory Overview
          </h2>
        </div>
        <GradientButton
          icon={<FaArrowRight className="w-3 h-3" />}
          size={undefined}
        >
          View All
        </GradientButton>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sky-200/50">
              <th className="pb-3 text-left text-gray-600 font-medium">SKU</th>
              <th className="pb-3 text-left text-gray-600 font-medium">Item</th>
              <th className="pb-3 text-left text-gray-600 font-medium">Qty</th>
              <th className="pb-3 text-left text-gray-600 font-medium">
                Location
              </th>
              <th className="pb-3 text-left text-gray-600 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-200/30">
            {inventoryItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-sky-50/50 transition-colors"
              >
                <td className="py-4 font-medium text-gray-800">{item.id}</td>
                <td className="py-4 text-gray-700">{item.name}</td>
                <td className="py-4 text-gray-700">{item.quantity}</td>
                <td className="py-4 text-gray-700">{item.location}</td>
                <td className="py-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default InventoryOverview;
