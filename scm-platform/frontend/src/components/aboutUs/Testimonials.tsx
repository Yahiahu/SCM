import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "FlowChain transformed our digital presence completely. Their innovative approach and attention to detail is unmatched. The results exceeded all our expectations.",
      name: "Sarah Johnson",
      role: "CEO, TechVision",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      quote:
        "Working with FlowChain was a game-changer. They understood our vision perfectly and delivered a solution that drove 300% growth in our user engagement.",
      name: "Michael Chen",
      role: "Founder, InnovateCorp",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      quote:
        "The team's expertise in modern technologies and user experience design helped us launch our product successfully. Highly recommended!",
      name: "Emily Rodriguez",
      role: "CTO, StartupHub",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-32 relative z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-sky-100/80 border border-sky-200/70 rounded-full text-sm font-medium text-sky-700 mb-6 backdrop-blur-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Client
            <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
              {" "}
              Love
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-sky-200/50 hover:border-sky-300/70 transition-all group shadow-lg"
            >
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-amber-400" />
                ))}
              </div>

              <FaQuoteLeft className="text-sky-400 text-2xl mb-6 opacity-60" />

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-sky-300/50"
                />
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
