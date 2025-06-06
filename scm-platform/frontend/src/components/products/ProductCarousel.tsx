"use client";

import Slider from "react-slick";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  stock: number;
  description: string;
}

interface ProductCarouselProps {
  products: Product[];
}

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [slider, setSlider] = useState<Slider | null>(null);
  const router = useRouter();

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60";

  if (!products || products.length === 0) {
    return (
      <div className="mb-16 text-center text-gray-600 dark:text-gray-300">
        No featured products to display.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden mb-16">
      {/* Slick Carousel CSS */}
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />

      {/* Left Arrow */}
      <button
        aria-label="left-arrow"
        className="absolute z-20 left-[30%] md:left-10 top-[90%] md:top-1/2 transform -translate-y-1/2 text-white hover:bg-black/30 bg-black/20 backdrop-blur-md rounded-full p-2 transition"
        onClick={() => slider?.slickPrev()}
      >
        <BiLeftArrowAlt size="36" />
      </button>

      {/* Right Arrow */}
      <button
        aria-label="right-arrow"
        className="absolute z-20 right-[30%] md:right-10 top-[90%] md:top-1/2 transform -translate-y-1/2 text-white hover:bg-black/30 bg-black/20 backdrop-blur-md rounded-full p-2 transition"
        onClick={() => slider?.slickNext()}
      >
        <BiRightArrowAlt size="36" />
      </button>

      {/* Slider */}
      <Slider {...settings} ref={(s) => setSlider(s)}>
        {products.map((product) => (
          <div
            key={product.id}
            className="h-[600px] relative bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${product.imageUrl || fallbackImage})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Content */}
            <div className="container mx-auto h-full relative z-10 px-4">
              <div className="max-w-lg absolute top-1/2 -translate-y-1/2 text-white space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  {product.name}
                </h2>
                <p className="text-base lg:text-lg text-gray-100 line-clamp-3">
                  {product.description}
                </p>
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-xl transition shadow-md"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  View Product
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
