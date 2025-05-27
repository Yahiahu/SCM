import Slider from "react-slick";
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
  Button, // Added for a "View" button
} from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Added for navigation

// Assuming 'Product' interface is defined in the parent or globally
interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  stock: number;
  description: string;
}

interface ProductCarouselProps {
  products: Product[]; // Accept products as a prop
}

// Slider settings
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
  const router = useRouter(); // Hook for navigation

  // Responsive settings for arrows
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  // Use a fallback image if product.imageUrl is missing
  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60";

  // Don't render if no products
  if (!products || products.length === 0) {
    return (
      <Box mb={16}>
        <Text>No featured products to display.</Text>
      </Box>
    );
  }

  return (
    <Box position="relative" width="full" overflow="hidden" mb={16}>
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
      <IconButton
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform="translate(0%, -50%)"
        zIndex={2}
        onClick={() => slider?.slickPrev()}
        color="white" // Ensure arrows are visible on dark images
        _hover={{ bg: "blackAlpha.300" }}
      >
        <BiLeftArrowAlt size="40px" />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform="translate(0%, -50%)"
        zIndex={2}
        onClick={() => slider?.slickNext()}
        color="white" // Ensure arrows are visible on dark images
        _hover={{ bg: "blackAlpha.300" }}
      >
        <BiRightArrowAlt size="40px" />
      </IconButton>

      {/* Slider Component */}
      <Slider {...settings} ref={(s) => setSlider(s)}>
        {/* Map over the products prop */}
        {products.map((product) => (
          <Box
            key={product.id} // Use product.id as the key
            height="600px"
            position="relative" // Needed for the overlay
            backgroundImage={`url(${product.imageUrl || fallbackImage})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
          >
            {/* Add an overlay for better text readability */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.500" // Adjust darkness as needed
            />
            <Container size="container.lg" height="600px" position="relative">
              <Stack
                spacing={6}
                w="full"
                maxW="lg"
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
                color="white" // Set text color to white for contrast
              >
                <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                  {product.name}
                </Heading>
                <Text fontSize={{ base: "md", lg: "lg" }} color="gray.100">
                  {product.description}
                </Text>
                {/* Optional: Add a button */}
                <Button
                  colorScheme="cyan"
                  variant="solid"
                  size="lg"
                  w="fit-content"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  View Product
                </Button>
              </Stack>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
