"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AddProductCard() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="relative w-full max-w-sm h-[42rem] cursor-pointer rounded-3xl border-2 border-dashed border-cyan-300 bg-white/60 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-cyan-500 hover:bg-white/80 hover:shadow-lg dark:bg-gray-800/60 dark:hover:bg-gray-700/80"
        onClick={() => router.push("/product/new")}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 px-4 text-center">
          <PlusIcon className="w-8 h-8 text-cyan-500" />
          <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">
            Add New Product
          </span>
        </div>
      </div>
    </div>
  );
}
