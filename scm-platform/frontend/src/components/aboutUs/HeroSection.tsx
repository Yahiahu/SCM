import { motion } from "framer-motion";
import { FaPlay, FaArrowRight } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const HeroSection = ({ y, opacity }: { y: any; opacity: any }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-sky-100/80 border border-sky-200/70 rounded-full text-sm font-medium text-sky-700 backdrop-blur-sm"
          >
            ✨ Digital Innovation Agency
          </motion.span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-gray-800">
            We Create
            <span className="block bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 bg-clip-text text-transparent">
              Digital Magic
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transforming ambitious ideas into extraordinary digital experiences
            that captivate, engage, and drive unprecedented growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-2xl font-semibold text-lg flex items-center gap-3 shadow-lg"
            >
              <FaPlay className="w-4 h-4" />
              Start Your Journey
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-sky-200/70 bg-white/50 rounded-2xl font-semibold text-lg backdrop-blur-sm hover:bg-white/80 transition-all text-gray-700"
            >
              View Our Work
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <FiChevronDown className="w-8 h-8 text-sky-500/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
