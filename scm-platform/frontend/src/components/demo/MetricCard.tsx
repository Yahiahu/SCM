import { motion } from "framer-motion";

const MetricCard = ({
  icon,
  iconBg,
  iconBorder,
  title,
  value,
  unit,
  trend,
  trendColor,
  isProgress = false,
}: {
  icon: any;
  iconBg: any;
  iconBorder: any;
  title: any;
  value: any;
  unit: any;
  trend: any;
  trendColor: any;
  isProgress?: any;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${iconBg} border ${iconBorder}`}>
          {icon}
        </div>
        <h3 className="text-gray-500 font-medium">{title}</h3>
      </div>
      {isProgress ? (
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full"
              style={{ width: value }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{unit}</p>
        </div>
      ) : (
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{unit}</p>
          </div>
          {trend && (
            <div
              className={`text-sm ${trendColor} px-2 py-1 rounded-full flex items-center`}
            >
              {trend}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
