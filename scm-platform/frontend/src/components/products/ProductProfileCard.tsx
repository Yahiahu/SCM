"use client";
import { useRouter } from "next/navigation";
import { Package, TrendingUp, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  stock: number;
}

interface ProductProfileCardProps {
  product: Product;
}

function ProductProfileCard({ product }: ProductProfileCardProps) {
  const router = useRouter();

  const getStockStatus = () => {
    if (product.stock > 50)
      return {
        label: "High Stock",
        color: "bg-emerald-500",
        textColor: "text-emerald-50",
      };
    if (product.stock > 20)
      return {
        label: "Medium Stock",
        color: "bg-amber-500",
        textColor: "text-amber-50",
      };
    if (product.stock > 0)
      return {
        label: "Low Stock",
        color: "bg-orange-500",
        textColor: "text-orange-50",
      };
    return {
      label: "Out of Stock",
      color: "bg-red-500",
      textColor: "text-red-50",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="flex justify-center"
    >
      <div
        className="relative w-full max-w-sm bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 group border border-sky-100 dark:border-sky-800/50"
        onClick={() => router.push(`/product/${product.id}`)}
      >
        {/* Header with gradient */}
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-800 dark:to-sky-900">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-sky-300 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-blue-300 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-sky-400 rounded-full blur-md transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Product icon/placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sky-200 dark:border-sky-700"
            >
              <Package className="w-16 h-16 text-sky-600 dark:text-sky-400" />
            </motion.div>
          </div>

          {/* Stock status badge */}
          <div
            className={`absolute top-4 right-4 ${stockStatus.color} ${stockStatus.textColor} text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
          >
            {stockStatus.label}
          </div>

          {/* Favorite/Star indicator */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Star className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 relative">
          {/* Product name and category */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
              {product.name}
            </h3>
            <div className="inline-flex items-center px-3 py-1 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-sm font-medium rounded-full">
              {product.category}
            </div>
          </div>

          {/* Stats section */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900/40 rounded-xl mb-2">
                <Package className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <p className="font-bold text-lg text-gray-900 dark:text-white">

              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Units Available
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900/40 rounded-xl mb-2">
                <TrendingUp className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <p className="font-bold text-lg text-gray-900 dark:text-white">
                High
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Performance
              </p>
            </div>
          </div>

          {/* Description preview */}
          {product.description && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-2">
                {product.description}
              </p>
            </div>
          )}

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product.id}`);
            }}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-blue-600/0 group-hover:from-sky-400/5 group-hover:to-blue-600/5 transition-all duration-500 pointer-events-none rounded-3xl"></div>
      </div>
    </motion.div>
  );
}

export default ProductProfileCard;
