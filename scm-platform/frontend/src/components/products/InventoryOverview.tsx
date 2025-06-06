import {
  FaBoxes,
  FaChartLine,
  FaWarehouse,
  FaShippingFast,
} from "react-icons/fa";
import { Product } from "./theme";
import { StatsCard } from "./StatsCard";

interface InventoryOverviewProps {
  products: Product[];
}

export function InventoryOverview({ products }: InventoryOverviewProps) {
  const getProductStats = () => {
    const inStock = products.filter((p) => p.stock > 10).length;
    const lowStock = products.filter(
      (p) => p.stock > 0 && p.stock <= 10
    ).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;

    return [
      {
        title: "Total Products",
        value: products.length,
        icon: FaBoxes,
        change: "+12%",
        isPositive: true,
      },
      {
        title: "In Stock",
        value: inStock,
        icon: FaWarehouse,
        change: "+5%",
        isPositive: true,
      },
      {
        title: "Low Stock",
        value: lowStock,
        icon: FaChartLine,
        change: "-3%",
        isPositive: false,
      },
      {
        title: "Out of Stock",
        value: outOfStock,
        icon: FaShippingFast,
        change: "+2%",
        isPositive: false,
      },
    ];
  };

  const stats = getProductStats();

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Inventory Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
