import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type SizeType = "sm" | "md" | "lg";

interface GradientButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  icon?: ReactNode;
  size?: SizeType;
}

const GradientButton = ({
  children,
  icon,
  size = "md",
  ...props
}: GradientButtonProps) => {
  const sizes: Record<SizeType, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${sizes[size]} bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all`}
      {...props}
    >
      {children}
      {icon}
    </motion.button>
  );
};

export default GradientButton;
