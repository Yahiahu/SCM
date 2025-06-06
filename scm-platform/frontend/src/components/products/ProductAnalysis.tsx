import { TopProductsTable } from "./TopProductsTable";
import { SalesByCategoryChart } from "./SalesByCategoryChart";
import { MonthlySalesChart } from "./MonthlysalesChart";
import { Product } from "./theme";
import { Button } from "@/components/ui/button"; // shadcn/ui button

interface ProductAnalyticsProps {
  products: Product[];
  onExportCSV: () => void;
}

export function ProductAnalytics({
  products,
  onExportCSV,
}: ProductAnalyticsProps) {
  return (
    <div className="bg-sky-50 p-6 rounded-xl shadow-sm mb-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Product Analytics
        </h2>
        <Button size="sm" onClick={onExportCSV}>
          Export Data
        </Button>
      </div>

      <div className="mb-10">
        <TopProductsTable products={products} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Sales by Category
          </h3>
          <SalesByCategoryChart />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Monthly Sales Trend
          </h3>
          <MonthlySalesChart />
        </div>
      </div>
    </div>
  );
}
