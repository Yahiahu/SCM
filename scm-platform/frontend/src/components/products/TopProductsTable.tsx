import { Product } from "./theme";
import { Download, TrendingUp, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopProductsTableProps {
  products: Product[];
  onExport?: () => void;
  className?: string;
}

export function TopProductsTable({
  products,
  onExport,
  className = "",
}: TopProductsTableProps) {
  // Sort products by stock level for "top performing" logic
  const topProducts = products.sort((a, b) => b.stock - a.stock).slice(0, 10);
  const router = useRouter();

  const getStockStatus = (stock: number) => {
    if (stock > 50)
      return { label: "High", color: "text-green-600", bgColor: "bg-green-50" };
    if (stock > 20)
      return {
        label: "Medium",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      };
    if (stock > 0)
      return {
        label: "Low",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      };
    return { label: "Out", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const getPerformanceWidth = (stock: number) => {
    const maxStock = Math.max(...products.map((p) => p.stock));
    return maxStock > 0 ? (stock / maxStock) * 100 : 0;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Top Performing Products
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Products ranked by stock levels and performance
            </p>
          </div>
        </div>

        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Rank
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Product
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Category
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Stock Level
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {topProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                const performanceWidth = getPerformanceWidth(product.stock);

                return (
                  <tr
                    key={product.id}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="cursor-pointer hover:bg-sky-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div
                          className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${
                            index < 10000000
                              ? "bg-gradient-to-r from-sky-400 to-sky-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }
                        `}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                          <Package className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {product.category}
                      </span>
                    </td>

                    {/* Stock Level */}
                    <td className="py-4 px-6">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100"></div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        units
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${stockStatus.color} ${stockStatus.bgColor}
                      `}
                      >
                        {stockStatus.label}
                      </span>
                    </td>

                    {/* Performance Bar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-sky-400 to-sky-600 h-full rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${performanceWidth}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[45px]">
                          {Math.round(performanceWidth)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {topProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no products to display at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Showing top {Math.min(topProducts.length, 10)} of {products.length}{" "}
        products
      </div>
    </div>
  );
}
