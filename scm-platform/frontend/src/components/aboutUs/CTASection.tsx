import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const CTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-32 relative z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-200/30 via-blue-200/30 to-cyan-200/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800">
            Ready to Create
            <span className="block bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Something Amazing?
            </span>
          </h2>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Let's transform your vision into a digital masterpiece that
            captivates your audience and drives exceptional results.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
            >
              Start Your Project
              <FaArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-sky-200/70 bg-white/50 rounded-2xl font-semibold text-lg backdrop-blur-sm hover:bg-white/80 transition-all text-gray-700"
            >
              Schedule a Call
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTASection;
