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

function ProductCarousel({ products }: ProductCarouselProps) {
  const [slider, setSlider] = useState<Slider | null>(null);
  const router = useRouter();

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60";

  if (!products || products.length === 0) {
    return (
      <div className="mb-16">
        <p>No featured products to display.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden mb-16">
      {/* Slick Carousel CSS links */}
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
        className="absolute z-20 left-[30%] md:left-10 top-[90%] md:top-1/2 transform -translate-y-1/2 text-white hover:bg-black/30 rounded-full p-2 transition-colors duration-200"
        onClick={() => slider?.slickPrev()}
      >
        <BiLeftArrowAlt size="40px" />
      </button>

      {/* Right Arrow */}
      <button
        aria-label="right-arrow"
        className="absolute z-20 right-[30%] md:right-10 top-[90%] md:top-1/2 transform -translate-y-1/2 text-white hover:bg-black/30 rounded-full p-2 transition-colors duration-200"
        onClick={() => slider?.slickNext()}
      >
        <BiRightArrowAlt size="40px" />
      </button>

      {/* Slider Component */}
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
            <div className="absolute inset-0 bg-black/50" />

            <div className="container mx-auto h-[600px] relative px-4">
              <div className="max-w-lg absolute top-1/2 transform -translate-y-1/2 text-white space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  {product.name}
                </h1>
                <p className="text-base lg:text-lg text-gray-100">
                  {product.description}
                </p>
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 w-fit"
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

export default ProductCarousel;
