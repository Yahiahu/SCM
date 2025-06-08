import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin, FaGithub, FaDribbble } from "react-icons/fa";

const SocialIcons = () => {
  const socialLinks = [
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaLinkedin />, href: "#" },
    { icon: <FaGithub />, href: "#" },
    { icon: <FaDribbble />, href: "#" },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((social, index) => (
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
  );
};

export default SocialIcons;
