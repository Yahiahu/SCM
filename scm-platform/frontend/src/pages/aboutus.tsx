import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FaCodeBranch,
  FaUsers,
  FaTrophy,
  FaRocket,
  FaHeart,
  FaQuoteLeft,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDribbble,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

const AboutUsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { value: "150+", label: "Projects Delivered", icon: <FaRocket /> },
    { value: "98%", label: "Client Satisfaction", icon: <FaHeart /> },
    { value: "50+", label: "Team Members", icon: <FaUsers /> },
    { value: "5", label: "Years of Excellence", icon: <FaTrophy /> },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 overflow-x-hidden relative">
      <BlurredBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Navigation */}
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
            {["Home", "About", "Services", "Work", "Contact"].map(
              (item, index) => (
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
              )
            )}
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

      {/* Hero Section */}
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
              Transforming ambitious ideas into extraordinary digital
              experiences that captivate, engage, and drive unprecedented
              growth.
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

      {/* Stats Section */}
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

      {/* About Story Section */}
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
                  and create lasting impact in an ever-evolving digital
                  landscape.
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
                      To empower businesses with innovative digital solutions
                      that drive growth, enhance user experiences, and create
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

      {/* Values Section */}
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

      {/* Testimonials Section */}
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
                    <p className="font-bold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="py-16 border-t border-sky-200/50 relative z-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mr-3 shadow-lg">
                  <FaCodeBranch className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  FlowChain
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Creating extraordinary digital experiences that transform
                businesses and inspire users worldwide.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <FaTwitter />, href: "#" },
                  { icon: <FaLinkedin />, href: "#" },
                  { icon: <FaGithub />, href: "#" },
                  { icon: <FaDribbble />, href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl bg-sky-100/80 border border-sky-200/70 flex items-center justify-center text-gray-600 hover:text-sky-600 hover:border-sky-300/70 transition-all backdrop-blur-sm"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Services",
                links: [
                  "Web Development",
                  "Mobile Apps",
                  "UI/UX Design",
                  "Digital Strategy",
                ],
              },
              {
                title: "Company",
                links: ["About Us", "Our Team", "Careers", "Contact"],
              },
              {
                title: "Resources",
                links: ["Blog", "Case Studies", "Newsletter", "Support"],
              },
            ].map((section, index) => (
              <div key={index} className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-sky-600 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-sky-200/50 mt-12 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} FlowChain. All rights reserved.
              Crafted with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
