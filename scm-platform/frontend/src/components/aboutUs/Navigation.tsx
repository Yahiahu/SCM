import { motion } from "framer-motion";
import { FaCodeBranch } from "react-icons/fa";

const Navigation = ({ isScrolled }: { isScrolled: boolean }) => {
  const navItems = ["Home", "About", "Services", "Work", "Contact"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-sky-200/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform shadow-lg">
            <FaCodeBranch className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            FlowChain
          </span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href="#"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative text-gray-600 hover:text-sky-600 transition-colors group font-medium"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-sky-400/25 transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
