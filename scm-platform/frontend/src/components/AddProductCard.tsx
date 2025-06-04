"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@radix-ui/react-icons";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

function AddProductCard() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center py-6">
      <div
        className="relative w-full max-w-[300px] h-[368px] bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-600"
        onClick={() => router.push("/product/new")}
      >
        <AspectRatio.Root ratio={1 / 1}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <PlusIcon className="w-10 h-10 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                Add New Product
              </span>
            </div>
          </div>
        </AspectRatio.Root>
      </div>
    </div>
  );
}

export default AddProductCard;
