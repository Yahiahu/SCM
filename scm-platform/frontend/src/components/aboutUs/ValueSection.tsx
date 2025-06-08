import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaTrophy, FaHeart } from "react-icons/fa";

const ValuesSection = () => {
  const values = [
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: "Innovation First",
      description:
        "We push boundaries and embrace cutting-edge technologies to deliver revolutionary solutions.",
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Client Partnership",
      description:
        "We believe in true collaboration, working as an extension of your team to achieve shared goals.",
    },
    {
      icon: <FaTrophy className="w-8 h-8" />,
      title: "Excellence Driven",
      description:
        "Every project is an opportunity to exceed expectations and deliver exceptional results.",
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Passion Powered",
      description:
        "Our love for creating amazing digital experiences drives everything we do.",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-32 relative z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-blue-100/50 to-cyan-100/50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-sky-100/80 border border-sky-200/70 rounded-full text-sm font-medium text-sky-700 mb-6 backdrop-blur-sm">
            Our Values
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            What Drives
            <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
              {" "}
              Us
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-sky-200/50 hover:border-sky-300/70 transition-all group shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-100/80 border border-sky-200/70 text-sky-600 mb-6 group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ValuesSection;
