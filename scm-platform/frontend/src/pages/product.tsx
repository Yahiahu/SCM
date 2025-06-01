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
  useToast,
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
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  description: string;
  qty: number;
  notes?: string;
  organizationId?: number;
  status?: "In Stock" | "Low Stock" | "Out of Stock";
  category?: string;
  imageUrl?: string;
  price?: number;
}

function ProductProfileCard({ product }: { product: Product }) {
  const router = useRouter();
  const statusColor = {
    "In Stock": "green",
    "Low Stock": "orange",
    "Out of Stock": "red",
  };

  // Determine product status based on quantity
  const getProductStatus = (
    qty: number
  ): "In Stock" | "Low Stock" | "Out of Stock" => {
    if (qty <= 0) return "Out of Stock";
    if (qty <= 10) return "Low Stock";
    return "In Stock";
  };

  const status = getProductStatus(product.qty);

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
          src={
            product.imageUrl ||
            "https://via.placeholder.com/300x180?text=No+Image"
          }
          objectFit={"cover"}
          alt={`Image of ${product.name}`}
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme={statusColor[status]}
          px={2}
          py={1}
          rounded="full"
        >
          {status}
        </Badge>
      </Box>
      <Box p={6}>
        <Stack spacing={1} mb={4}>
          <Heading fontSize={"lg"} fontWeight={600}>
            {product.name}
          </Heading>
          <Text color={"gray.500"} fontSize="sm">
            {product.category || "Uncategorized"}
          </Text>
        </Stack>

        <Box mb={4}>
          <Text fontWeight="bold" fontSize="xl" color="brand.600">
            ${product.price?.toFixed(2) || "N/A"}
          </Text>
          <Flex align="center" mt={1}>
            <Text fontSize="sm" color="gray.500" mr={2}>
              Stock: {product.qty}
            </Text>
            <Progress
              value={(product.qty / 100) * 100}
              size="xs"
              colorScheme={
                product.qty > 20 ? "green" : product.qty > 0 ? "orange" : "red"
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
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    qty: "",
    notes: "",
    category: "",
    price: "",
    imageUrl: "",
    designFiles: "",
    warnings: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          qty: parseInt(formData.qty),
          notes: formData.notes,
          image_url: formData.imageUrl,
          design_files: formData.designFiles,
          warnings: formData.warnings,
          organizationId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      toast({
        title: "Product created",
        description: "The new product has been added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
      // You might want to refresh the product list here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mt="0px" maxH="100vh" overflowY="auto">
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

                <FormControl>
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

                <FormControl>
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
                    name="qty"
                    type="number"
                    value={formData.qty}
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

                <FormControl gridColumn={{ md: "1 / -1" }}>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.png"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Design Files (URL)</FormLabel>
                  <Input
                    name="designFiles"
                    value={formData.designFiles}
                    onChange={handleChange}
                    placeholder="https://example.com/design.zip"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Warnings</FormLabel>
                  <Textarea
                    name="warnings"
                    value={formData.warnings}
                    onChange={handleChange}
                    placeholder="E.g., Handle with care"
                    rows={2}
                  />
                </FormControl>
              </SimpleGrid>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="brand"
              mr={3}
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
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
        {products.slice(0, 3).map((product) => (
          <Box
            key={product.id}
            height={{ base: "400px", md: "500px" }}
            position="relative"
            backgroundImage={`url(${
              product.imageUrl ||
              "https://via.placeholder.com/1200x500?text=No+Image"
            })`}
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
  const toast = useToast();
  const [isClient, setIsClient] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
  }, []);

  const handleExportCSV = () => {
    const headers = ["Product", "Category", "Sales", "Revenue", "Stock"];
    const rows = products
      .sort((a, b) => (b.price || 0) * (b.qty || 0) - (a.price || 0) * (a.qty || 0))
      .slice(0, 5)
      .map((product) => [
        product.name,
        product.category,
        Math.floor(Math.random() * 100) + 50,
        ((product.price || 0) * 50).toFixed(2),
        product.qty,
      ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "product_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Enhance products with additional UI-specific fields
      const enhancedProducts = data.map((product: Product) => ({
        ...product,
        category: product.notes?.includes("batch")
          ? "Industrial IoT"
          : "Electronics", // Example mapping
        imageUrl: getProductImage(product.name),
        price: getProductPrice(product.name),
      }));
      setProducts(enhancedProducts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get appropriate image based on product name
  const getProductImage = (name: string) => {
    if (name.includes("Thermostat")) {
      return "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?auto=format&fit=crop&w=900&q=60";
    } else if (name.includes("Sensor")) {
      return "https://images.unsplash.com/photo-1438183972690-6d4658e3290e?auto=format&fit=crop&w=2274&q=80";
    } else if (name.includes("Gearbox")) {
      return "https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?auto=format&fit=crop&w=900&q=60";
    } else if (name.includes("Drone")) {
      return "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=900&q=60";
    }
    return "https://via.placeholder.com/300x180?text=No+Image";
  };

  // Helper function to assign prices based on product name
  const getProductPrice = (name: string) => {
    if (name.includes("Thermostat")) return 199.99;
    if (name.includes("Sensor")) return 149.99;
    if (name.includes("Gearbox")) return 299.99;
    if (name.includes("Drone")) return 249.99;
    return 99.99;
  };

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
  const getProductStats = () => {
    const inStock = products.filter((p) => p.qty > 10).length;
    const lowStock = products.filter((p) => p.qty > 0 && p.qty <= 10).length;
    const outOfStock = products.filter((p) => p.qty <= 0).length;

    return [
      {
        title: "Total Products",
        value: products.length,
        icon: FaBoxes,
        change: "+12%",
        isPositive: true,
      },
      {
        title: "In Stock",
        value: inStock,
        icon: FaWarehouse,
        change: "+5%",
        isPositive: true,
      },
      {
        title: "Low Stock",
        value: lowStock,
        icon: FaChartLine,
        change: "-3%",
        isPositive: false,
      },
      {
        title: "Out of Stock",
        value: outOfStock,
        icon: FaShippingFast,
        change: "+2%",
        isPositive: false,
      },
    ];
  };

  const stats = getProductStats();

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
          {products.length > 0 && (
            <Box bg="blue.100" borderRadius="lg" mb={12} p={4}>
              <ProductCarousel products={products} />
            </Box>
          )}

          {/* Dashboard Stats */}
{/* Dashboard Stats */}
<Box mb={12}>
  <Heading size="lg" mb={6} color="gray.700">
    Inventory Overview
  </Heading>
  <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
    {stats.map((stat, index) => (
      <Box
        key={index}
        bg={stat.isPositive ? "green.50" : "red.50"}
        p={6}
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor={stat.isPositive ? "green.100" : "red.100"}
        borderLeft="4px solid"
        borderLeftColor={stat.isPositive ? "green.400" : "red.400"}
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
              color={stat.isPositive ? "green.500" : "red.500"}
            />
            {stat.change}
          </StatHelpText>
        </Stat>
      </Box>
    ))}
  </SimpleGrid>
</Box>
</Container>

        {/* Analytics Dashboard */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" mb={12}>
          <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg" color="gray.700">
              Product Analytics
            </Heading>
            <Button colorScheme="brand" size="sm" onClick={handleExportCSV}>
              Export Data
            </Button>
          </Flex>

          {/* Top Performing Products Table */}
          <Box mb={10}>
            <Heading size="md" mb={4} color="gray.600">
              Top Performing Products
            </Heading>
            <Box overflowX="auto">
              <Box
                as="table"
                width="full"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <Box as="thead" bg="gray.50">
                  <Box as="tr">
                    <Box
                      as="th"
                      px={6}
                      py={3}
                      textAlign="left"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Product
                    </Box>
                    <Box
                      as="th"
                      px={6}
                      py={3}
                      textAlign="right"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Sales
                    </Box>
                    <Box
                      as="th"
                      px={6}
                      py={3}
                      textAlign="right"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Revenue
                    </Box>
                    <Box
                      as="th"
                      px={6}
                      py={3}
                      textAlign="right"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Stock
                    </Box>
                    <Box
                      as="th"
                      px={6}
                      py={3}
                      textAlign="right"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      % of Total
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {products
                    .sort(
                      (a, b) =>
                        (b.price || 0) * (b.qty || 0) -
                        (a.price || 0) * (a.qty || 0)
                    )
                    .slice(0, 5)
                    .map((product) => (
                      <Box
                        as="tr"
                        key={product.id}
                        _even={{ bg: "gray.50" }}
                        _hover={{ bg: "gray.100" }}
                      >
                        <Box as="td" px={6} py={4} borderTopWidth="1px">
                          <Text fontWeight="medium">{product.name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {product.category}
                          </Text>
                        </Box>
                        <Box
                          as="td"
                          px={6}
                          py={4}
                          textAlign="right"
                          borderTopWidth="1px"
                        >
                          {Math.floor(Math.random() * 100) + 50}
                        </Box>
                        <Box
                          as="td"
                          px={6}
                          py={4}
                          textAlign="right"
                          borderTopWidth="1px"
                        >
                          ${((product.price || 0) * 50).toLocaleString()}
                        </Box>
                        <Box
                          as="td"
                          px={6}
                          py={4}
                          textAlign="right"
                          borderTopWidth="1px"
                        >
                          {product.qty}
                        </Box>
                        <Box
                          as="td"
                          px={6}
                          py={4}
                          textAlign="right"
                          borderTopWidth="1px"
                        >
                          <Progress
                            value={Math.floor(Math.random() * 30) + 20}
                            size="sm"
                            colorScheme="brand"
                            borderRadius="full"
                          />
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Sales Breakdown */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
            <Box>
              <Heading size="md" mb={4} color="gray.600">
                Sales by Category
              </Heading>
              <Box
                bg="white"
                p={4}
                borderRadius="lg"
                height="300px"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="sm"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Electronics", value: 400, color: "#3182CE" },
                        {
                          name: "Home Automation",
                          value: 300,
                          color: "#805AD5",
                        },
                        {
                          name: "Industrial IoT",
                          value: 200,
                          color: "#38A169",
                        },
                        {
                          name: "Mechanical Parts",
                          value: 100,
                          color: "#DD6B20",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {[
                        { name: "Electronics", value: 400, color: "#3182CE" },
                        {
                          name: "Home Automation",
                          value: 300,
                          color: "#805AD5",
                        },
                        {
                          name: "Industrial IoT",
                          value: 200,
                          color: "#38A169",
                        },
                        {
                          name: "Mechanical Parts",
                          value: 100,
                          color: "#DD6B20",
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} sales`, ""]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E2E8F0",
                        borderRadius: "md",
                        boxShadow: "md",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
            <Box>
              <Heading size="md" mb={4} color="gray.600">
                Monthly Sales Trend
              </Heading>
              <Box
                bg="white"
                p={4}
                borderRadius="lg"
                height="300px"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="sm"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: "Jan", sales: 4000 },
                      { name: "Feb", sales: 3000 },
                      { name: "Mar", sales: 5000 },
                      { name: "Apr", sales: 2780 },
                      { name: "May", sales: 1890 },
                      { name: "Jun", sales: 2390 },
                      { name: "Jul", sales: 3490 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3182CE"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3182CE"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#718096" }}
                      tickLine={{ stroke: "#E2E8F0" }}
                    />
                    <YAxis
                      tick={{ fill: "#718096" }}
                      tickLine={{ stroke: "#E2E8F0" }}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E2E8F0",
                        borderRadius: "md",
                        boxShadow: "md",
                      }}
                      formatter={(value) => [`$${value}`, "Sales"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3182CE"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
        {/* Products Section */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" mb={12}>
          <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg" color="gray.700">
              Product Inventory
            </Heading>
          </Flex>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
            <AddProductCard />
            {products.map((product) => (
              <ProductProfileCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}
