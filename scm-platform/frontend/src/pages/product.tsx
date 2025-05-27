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
  Badge,
  Progress,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  FaBoxes,
  FaChartLine,
  FaWarehouse,
  FaShippingFast,
} from "react-icons/fa";
import Slider from "react-slick";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Theme extension with blue color scheme
const theme = extendTheme({
  colors: {
    brand: {
      50: "#e0f7fa",
      100: "#b3e5fc",
      200: "#81d4fa",
      300: "#4fc3f7",
      400: "#29b6f6",
      500: "#03a9f4",
      600: "#039be5",
      700: "#0288d1",
      800: "#0277bd",
      900: "#01579b",
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
        fontWeight: "semibold",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
      },
    },
  },
});

interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  stock: number;
  description: string;
  price?: number;
  status?: "In Stock" | "Low Stock" | "Out of Stock";
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Smart Thermostat V1",
    category: "Home Automation",
    imageUrl:
      "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?auto=format&fit=crop&w=900&q=60",
    stock: 150,
    description: "WiFi enabled thermostat for modern homes.",
    price: 199.99,
    status: "In Stock",
  },
  {
    id: 2,
    name: "IoT Sensor Node",
    category: "Industrial IoT",
    imageUrl:
      "https://images.unsplash.com/photo-1438183972690-6d4658e3290e?auto=format&fit=crop&w=2274&q=80",
    stock: 300,
    description: "A versatile multi-sensor platform.",
    price: 149.99,
    status: "In Stock",
  },
  {
    id: 3,
    name: "Precision Gearbox",
    category: "Mechanical Parts",
    imageUrl:
      "https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?auto=format&fit=crop&w=900&q=60",
    stock: 5,
    description: "High-torque gearbox for demanding applications.",
    price: 299.99,
    status: "Low Stock",
  },
  {
    id: 4,
    name: "Wireless Camera",
    category: "Security",
    imageUrl:
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=900&q=60",
    stock: 0,
    description: "1080p HD wireless security camera with night vision.",
    price: 129.99,
    status: "Out of Stock",
  },
];

function ProductProfileCard({ product }: { product: Product }) {
  const router = useRouter();
  const statusColor = {
    "In Stock": "green",
    "Low Stock": "orange",
    "Out of Stock": "red",
  };

  return (
    <Box
      maxW={"300px"}
      w={"full"}
      bg="white"
      boxShadow={"md"}
      rounded={"lg"}
      overflow={"hidden"}
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "lg",
      }}
      onClick={() => router.push(`/product/${product.id}`)}
      border="1px solid"
      borderColor="gray.100"
    >
      <Box position="relative">
        <Image
          h={"180px"}
          w={"full"}
          src={product.imageUrl}
          objectFit={"cover"}
          alt={`Image of ${product.name}`}
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme={statusColor[product.status || "In Stock"]}
          px={2}
          py={1}
          rounded="full"
        >
          {product.status}
        </Badge>
      </Box>
      <Box p={6}>
        <Stack spacing={1} mb={4}>
          <Heading fontSize={"lg"} fontWeight={600}>
            {product.name}
          </Heading>
          <Text color={"gray.500"} fontSize="sm">
            {product.category}
          </Text>
        </Stack>

        <Box mb={4}>
          <Text fontWeight="bold" fontSize="xl" color="brand.600">
            ${product.price?.toFixed(2) || "N/A"}
          </Text>
          <Flex align="center" mt={1}>
            <Text fontSize="sm" color="gray.500" mr={2}>
              Stock: {product.stock}
            </Text>
            <Progress
              value={(product.stock / 100) * 100}
              size="xs"
              colorScheme={
                product.stock > 20
                  ? "green"
                  : product.stock > 0
                  ? "orange"
                  : "red"
              }
              flex="1"
              rounded="full"
            />
          </Flex>
        </Box>

        <Button
          w={"full"}
          colorScheme="brand"
          size="sm"
          rightIcon={<ChevronDownIcon />}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/product/${product.id}`);
          }}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
}

function AddProductCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <>
      <Box
        maxW={"300px"}
        w={"full"}
        h={"full"}
        minH={"400px"}
        bg="gray.50"
        boxShadow={"md"}
        rounded={"lg"}
        overflow={"hidden"}
        border={"2px dashed"}
        borderColor="gray.300"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition="all 0.2s ease-in-out"
        _hover={{
          borderColor: "brand.500",
          bg: "gray.100",
        }}
        onClick={onOpen}
      >
        <VStack spacing={4} color="gray.500">
          <Icon as={AddIcon} w={8} h={8} />
          <Text fontWeight="medium">Add New Product</Text>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Select category"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home Automation">Home Automation</option>
                    <option value="Industrial IoT">Industrial IoT</option>
                    <option value="Mechanical Parts">Mechanical Parts</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Stock Quantity</FormLabel>
                  <Input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                  />
                </FormControl>

                <FormControl isRequired gridColumn={{ md: "1 / -1" }}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </FormControl>
              </SimpleGrid>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleSubmit}>
              Save Product
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
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

function ProductCarousel({ products }: { products: Product[] }) {
  const [slider, setSlider] = useState<Slider | null>(null);
  const router = useRouter();

  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  if (!products || products.length === 0) return null;

  return (
    <Box
      position="relative"
      width="full"
      overflow="hidden"
      mb={16}
      borderRadius="lg"
      boxShadow="md"
    >
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
            height={{ base: "400px", md: "500px" }}
            position="relative"
            backgroundImage={`url(${product.imageUrl})`}
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
              bgGradient="linear(to-b, blackAlpha.600, blackAlpha.200)"
            />
            <Container size="container.lg" height="full" position="relative">
              <Stack
                spacing={6}
                w="full"
                maxW="lg"
                position="absolute"
                bottom={{ base: "10%", md: "20%" }}
                color="white"
                px={4}
              >
                <Heading fontSize={{ base: "2xl", md: "4xl" }}>
                  {product.name}
                </Heading>
                <Text fontSize={{ base: "md", lg: "lg" }} color="gray.100">
                  {product.description}
                </Text>
                <Button
                  colorScheme="brand"
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

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Simulate API fetch
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
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

  // Stats data
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: FaBoxes,
      change: "+12%",
      isPositive: true,
    },
    {
      title: "In Stock",
      value: products.filter((p) => p.status === "In Stock").length,
      icon: FaWarehouse,
      change: "+5%",
      isPositive: true,
    },
    {
      title: "Low Stock",
      value: products.filter((p) => p.status === "Low Stock").length,
      icon: FaChartLine,
      change: "-3%",
      isPositive: false,
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => p.status === "Out of Stock").length,
      icon: FaShippingFast,
      change: "+2%",
      isPositive: false,
    },
  ];

  return (
    <ChakraProvider theme={theme}>
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />
      <Navbar isLoggedIn={isLoggedIn} />
      <Box
        ml={sidebarVisible ? "180px" : "0"}
        transition="margin-left 0.3s ease"
        pt="80px"
        bg="gray.50"
        minH="100vh"
      >
        <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
          <ProductCarousel products={products} />

          {/* Dashboard Stats */}
          <Box mb={12}>
            <Heading size="lg" mb={6} color="gray.700">
              Inventory Overview
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
              {stats.map((stat, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Stat>
                    <HStack justify="space-between">
                      <StatLabel color="gray.500">{stat.title}</StatLabel>
                      <Icon as={stat.icon} color="brand.500" boxSize={6} />
                    </HStack>
                    <StatNumber fontSize="2xl" mt={2} color="gray.800">
                      {stat.value}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow
                        type={stat.isPositive ? "increase" : "decrease"}
                      />
                      {stat.change}
                    </StatHelpText>
                  </Stat>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Products Section */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" mb={12}>
            <Flex justify="space-between" align="center" mb={8}>
              <Heading size="lg" color="gray.700">
                Product Inventory
              </Heading>
              <Button colorScheme="brand" size="sm">
                Export Data
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
              <AddProductCard />
              {products.map((product) => (
                <ProductProfileCard key={product.id} product={product} />
              ))}
            </SimpleGrid>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}
