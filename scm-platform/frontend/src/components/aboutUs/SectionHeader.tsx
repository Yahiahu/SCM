import { motion } from "framer-motion";

const SectionHeader = ({
  tagline,
  title,
  gradientText,
  description,
}: {
  tagline: any;
  title: any;
  gradientText: any;
  description: any;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      {tagline && (
        <span className="inline-block px-4 py-2 bg-sky-100/80 border border-sky-200/70 rounded-full text-sm font-medium text-sky-700 mb-6 backdrop-blur-sm">
          {tagline}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
        {title}
        {gradientText && (
          <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
            {" "}
            {gradientText}
          </span>
        )}
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto"></div>
      {description && (
        <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
