import { motion } from "framer-motion";
import { FaRocket, FaArrowRight } from "react-icons/fa";

const AboutStorySection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-32 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-block px-4 py-2 bg-sky-100/80 border border-sky-200/70 rounded-full text-sm font-medium text-sky-700 mb-6 backdrop-blur-sm">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                Born from
                <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                  {" "}
                  Passion
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mb-8"></div>
            </div>

            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded in 2019 by a group of visionary developers and
                designers, FlowChain emerged from a simple belief: that
                exceptional digital experiences have the power to transform
                businesses and touch lives.
              </p>
              <p>
                What started as a small team working from a garage has evolved
                into a powerhouse of creative and technical talent, serving
                clients across the globe with cutting-edge solutions that push
                the boundaries of what's possible.
              </p>
              <p>
                Today, we're not just building websites and apps – we're
                crafting digital ecosystems that drive growth, inspire users,
                and create lasting impact in an ever-evolving digital landscape.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-sky-100/80 border border-sky-200/70 rounded-xl text-sky-700 font-medium hover:bg-sky-200/50 transition-all backdrop-blur-sm"
            >
              Learn More <FaArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <div className="aspect-square bg-white/80 backdrop-blur-xl border border-sky-200/50 shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-6 p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white mb-6 shadow-lg">
                    <FaRocket className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To empower businesses with innovative digital solutions that
                    drive growth, enhance user experiences, and create
                    meaningful connections in the digital world.
                  </p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-pink-300/30 to-red-300/30 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutStorySection;
