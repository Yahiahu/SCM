"use client";

import { useRouter } from "next/navigation";
import { FaBoxes, FaRulerCombined } from "react-icons/fa";
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
  const fallbackImage =
    "https://images.unsplash.com/photo-1579621970795-87f5a3a1_1a1?auto=format&fit=crop&w=300&q=60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center py-6"
    >
      <div
        className="relative w-full max-w-xs bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group"
        onClick={() => router.push(`/product/${product.id}`)}
      >
        {/* Product Image with gradient overlay */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={product.imageUrl || fallbackImage}
            alt={`Image of ${product.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Product Content */}
        <div className="p-6">
          {/* Title and Category */}
          <div className="text-center mb-5 space-y-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.category}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="font-semibold text-gray-900 dark:text-white">
                {product.stock}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                In Stock
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <FaBoxes className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Components
              </p>
            </div>
          </div>

          {/* View Button */}
          <button
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product.id}`);
            }}
          >
            View Details
          </button>
        </div>

        {/* Floating Tag (example) */}
        {product.stock > 0 && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            In Stock
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ProductProfileCard;
