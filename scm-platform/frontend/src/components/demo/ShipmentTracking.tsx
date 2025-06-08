import { motion } from "framer-motion";
import { FaTruck, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import GradientButton from "./GradientButton";
import StatusBadge from "./StatusBadge";

const shipments = [
  {
    id: "SH-1001",
    origin: "Factory A",
    destination: "Warehouse 1",
    status: "In Transit",
    eta: "2023-06-15",
  },
  {
    id: "SH-1002",
    origin: "Supplier B",
    destination: "Factory A",
    status: "Delayed",
    eta: "2023-06-18",
  },
  {
    id: "SH-1003",
    origin: "Warehouse 2",
    destination: "Retail Store",
    status: "Delivered",
    eta: "2023-06-10",
  },
];

const ShipmentTracking = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100/50 border border-blue-200/50">
            <FaTruck className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Shipment Tracking</h2>
        </div>
        <GradientButton
          icon={<FaArrowRight className="w-3 h-3" />}
          size={undefined}
        >
          View All
        </GradientButton>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => (
          <motion.div
            key={shipment.id}
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-xl border border-sky-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800">{shipment.id}</h3>
                <p className="text-sm text-gray-600">
                  {shipment.origin} → {shipment.destination}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <StatusBadge status={shipment.status} />
                <p className="text-xs text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-1" /> ETA: {shipment.eta}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  shipment.status === "Delivered"
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : shipment.status === "Delayed"
                    ? "bg-gradient-to-r from-red-400 to-red-600"
                    : "bg-gradient-to-r from-blue-400 to-blue-600"
                }`}
                style={{
                  width:
                    shipment.status === "Delivered"
                      ? "100%"
                      : shipment.status === "Delayed"
                      ? "60%"
                      : "80%",
                }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShipmentTracking;
