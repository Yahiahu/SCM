import { motion } from "framer-motion";
import { FaRocket, FaHeart, FaUsers, FaTrophy } from "react-icons/fa";

const StatsSection = () => {
  const stats = [
    { value: "150+", label: "Projects Delivered", icon: <FaRocket /> },
    { value: "98%", label: "Client Satisfaction", icon: <FaHeart /> },
    { value: "50+", label: "Team Members", icon: <FaUsers /> },
    { value: "5", label: "Years of Excellence", icon: <FaTrophy /> },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-100/80 border border-sky-200/70 mb-4 text-sky-600 group-hover:scale-110 transition-transform backdrop-blur-sm">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;
