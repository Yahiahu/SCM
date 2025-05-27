"use client";

import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
  ChakraProvider,
  extendTheme,
  Center,
  Image,
  Flex,
  Button,
  useColorModeValue,
  SimpleGrid,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { AddIcon } from "@chakra-ui/icons";
import { FaBoxes } from "react-icons/fa";
import Slider from "react-slick";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- Interface ---
interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  stock: number;
  description: string;
}

// --- Mock Data (Replace with API fetch) ---
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Smart Thermostat V1",
    category: "Home Automation",
    imageUrl:
      "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?auto=format&fit=crop&w=900&q=60",
    stock: 150,
    description: "WiFi enabled thermostat for modern homes.",
  },
  {
    id: 2,
    name: "IoT Sensor Node",
    category: "Industrial IoT",
    imageUrl:
      "https://images.unsplash.com/photo-1438183972690-6d4658e3290e?auto=format&fit=crop&w=2274&q=80",
    stock: 300,
    description: "A versatile multi-sensor platform.",
  },
  {
    id: 3,
    name: "Precision Gearbox",
    category: "Mechanical Parts",
    imageUrl:
      "https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?auto=format&fit=crop&w=900&q=60",
    stock: 50,
    description: "High-torque gearbox for demanding applications.",
  },
];

const theme = extendTheme({});

// --- ProductProfileCard Component ---
interface ProductProfileCardProps {
  product: Product;
}

function ProductProfileCard({ product }: ProductProfileCardProps) {
  const router = useRouter();
  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
        cursor="pointer"
        transition="transform 0.2s ease-in-out"
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: "lg",
        }}
        onClick={() => router.push(`/product/${product.id}`)}
      >
        <Image
          h={"150px"}
          w={"full"}
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1579621970795-87f5a3a1_1a1?auto=format&fit=crop&w=300&q=60"
          }
          objectFit={"cover"}
          alt={`Image of ${product.name}`}
        />
        <Box p={6}>
          <Stack spacing={1} align={"center"} mb={5}>
            <Heading fontSize={"xl"} fontWeight={500}>
              {product.name}
            </Heading>
            <Text color={"gray.500"} fontSize="sm">
              {product.category}
            </Text>
          </Stack>
          <Stack direction={"row"} justify={"center"} spacing={6} mb={6}>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>{product.stock}</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                In Stock
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}>
              <Icon as={FaBoxes} w={5} h={5} color="gray.600" />
              <Text fontSize={"sm"} color={"gray.500"}>
                View BOM
              </Text>
            </Stack>
          </Stack>
          <Button
            w={"full"}
            mt={4}
            bg={useColorModeValue("cyan.400", "cyan.600")}
            color={"white"}
            rounded={"md"}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
              bg: useColorModeValue("cyan.500", "cyan.700"),
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product.id}`);
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Center>
  );
}

// --- AddProductCard Component ---
function AddProductCard() {
  const router = useRouter();
  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        w={"full"}
        h={"368px"}
        bg={useColorModeValue("gray.50", "gray.700")}
        boxShadow={"lg"}
        rounded={"md"}
        overflow={"hidden"}
        border={`2px dashed ${useColorModeValue("gray.300", "gray.600")}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition="all 0.2s ease-in-out"
        _hover={{
          boxShadow: "xl",
          borderColor: "cyan.400",
          bg: useColorModeValue("gray.100", "gray.600"),
        }}
        onClick={() => router.push("/product/new")}
      >
        <VStack spacing={4}>
          <Icon as={AddIcon} w={10} h={10} color="gray.400" />
          <Text color="gray.500" fontWeight="medium">
            Add New Product
          </Text>
        </VStack>
      </Box>
    </Center>
  );
}

// --- ProductCarousel Component (FIXED) ---
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

// ** FIX 1: Ensure it returns JSX.Element and REMOVE ': void' **
function ProductCarousel({
  products,
}: ProductCarouselProps): JSX.Element | null {
  // Return JSX or null
  const [slider, setSlider] = useState<Slider | null>(null);
  const router = useRouter();

  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });
  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60";

  if (!products || products.length === 0) {
    return null; // Return null instead of just text, or a styled Box
  }

  // ** FIX 1: Ensure it RETURNS the JSX **
  return (
    <Box position="relative" width="full" overflow="hidden" mb={16}>
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
      <IconButton
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform="translate(0%, -50%)"
        zIndex={2}
        onClick={() => slider?.slickPrev()}
        color="white"
        _hover={{ bg: "blackAlpha.300" }}
      >
        <BiLeftArrowAlt size="40px" />
      </IconButton>
      <IconButton
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform="translate(0%, -50%)"
        zIndex={2}
        onClick={() => slider?.slickNext()}
        color="white"
        _hover={{ bg: "blackAlpha.300" }}
      >
        <BiRightArrowAlt size="40px" />
      </IconButton>
      <Slider {...settings} ref={(s) => setSlider(s)}>
        {products.map((product) => (
          <Box
            key={product.id}
            height="600px"
            position="relative"
            backgroundImage={`url(${product.imageUrl || fallbackImage})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.500"
            />
            <Container size="container.lg" height="600px" position="relative">
              <Stack
                spacing={6}
                w="full"
                maxW="lg"
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
                color="white"
              >
                <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                  {product.name}
                </Heading>
                <Text fontSize={{ base: "md", lg: "lg" }} color="gray.100">
                  {product.description}
                </Text>
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

// --- HomePage Component ---
export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const sidebarWidth = "180px";

  useEffect(() => {
    setIsClient(true);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/api/products");
        if (!response.ok) throw new Error("Failed to fetch");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(mockProducts); // Fallback to mock
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (status === "loading" || !isClient) return;
    const isLoggedIn = !!session || localStorage.getItem("user");
    if (!isLoggedIn) router.push("/login");
  }, [session, status, isClient, router]);

  if (!isClient || status === "loading" || loading) {
    return (
      <Center h="100vh">
        <Text>Loading...</Text>
      </Center>
    );
  }

  const isLoggedIn =
    !!session ||
    (typeof window !== "undefined" && !!localStorage.getItem("user"));

  return (
    <ChakraProvider theme={theme}>
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />
      <Navbar isLoggedIn={isLoggedIn} />
      <Box
        ml={sidebarVisible ? sidebarWidth : "10px"}
        transition="margin-left 0.3s ease"
        pt="80px"
      >
        <ProductCarousel products={products} />{" "}
        {/* Using the fixed component */}
        <Container maxW="7xl" py={10}>
          <Heading
            as="h2"
            size="xl"
            mb={8}
            textAlign={{ base: "center", md: "left" }}
          >
            All Products
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={10}>
            <AddProductCard />
            {products.map((product) => (
              <ProductProfileCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </Container>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}
