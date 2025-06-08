import { motion, HTMLMotionProps } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { ReactNode } from "react";

type VariantType = "primary" | "secondary";

interface GradientButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: VariantType;
  icon?: boolean;
}

const GradientButton = ({
  children,
  variant = "primary",
  icon,
  ...props
}: GradientButtonProps) => {
  const baseClasses =
    "px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3";

  const variants: Record<VariantType, { className: string; hover: object }> = {
    primary: {
      className: `${baseClasses} bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg`,
      hover: {
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
      },
    },
    secondary: {
      className: `${baseClasses} border-2 border-sky-200/70 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-gray-700`,
      hover: { scale: 1.05 },
    },
  };

  return (
    <motion.button
      whileHover={variants[variant].hover}
      whileTap={{ scale: 0.95 }}
      className={variants[variant].className}
      {...props}
    >
      {children}
      {icon && <FaArrowRight className="w-4 h-4" />}
    </motion.button>
  );
};

export default GradientButton;
