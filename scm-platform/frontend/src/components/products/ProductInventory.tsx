import AddProductCard from "../products/AddProductCard";
import ProductProfileCard from "../products/ProductProfileCard";
import { Product } from "./theme";

interface ProductInventoryProps {
  products: Product[];
}

export function ProductInventory({ products }: ProductInventoryProps) {
  return (
    <div className="bg-sky-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm mb-12">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AddProductCard />
        {products.map((product) => (
          <ProductProfileCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
