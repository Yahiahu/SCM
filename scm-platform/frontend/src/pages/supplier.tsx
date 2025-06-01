"use client";

import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Select,
  VStack,
  ChakraProvider,
  extendTheme,
  Badge,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Skeleton,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Tag,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiDownload,
  FiPrinter,
  FiEdit2,
  FiMoreVertical,
  FiArrowRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiTruck,
  FiStar,
  FiCalendar,
  FiTrash2,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";

// Custom theme with blue color scheme (same as components page)
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
        fontWeight: "semibold",
        borderRadius: "md",
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
    Table: {
      variants: {
        striped: {
          th: {
            color: "gray.600",
          },
          tbody: {
            tr: {
              "&:nth-of-type(odd)": {
                td: {
                  background: "brand.50",
                },
              },
            },
          },
        },
      },
    },
  },
});

interface Supplier {
  id: string;
  name: string;
  contact_email: string;
  phone: string;
  location: string;
  rating: number;
  historical_ontime_rate: number;
  avg_unit_cost: number;
  last_response_time: number; // in hours
  preferred: boolean;
  status: "Active" | "Inactive" | "On Hold";
  components_supplied?: number;
  last_order_date?: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contact_email: "",
    phone: "",
    location: "",
    rating: 4,
    preferred: false,
  });

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/supplier");
        if (!response.ok) {
          throw new Error("Failed to load suppliers");
        }
        const data = await response.json();

        // Enhance suppliers with additional UI fields
        const enhancedSuppliers = data.map((supplier: any) => ({
          ...supplier,
          status: supplier.preferred ? "Active" : "Inactive",
          components_supplied: Math.floor(Math.random() * 50) + 5, // Mock data
          last_order_date: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0], // Mock date
        }));

        setSuppliers(enhancedSuppliers);
        setFilteredSuppliers(enhancedSuppliers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load suppliers",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [toast]);

  // Filter and sort suppliers
  useEffect(() => {
    let result = [...suppliers];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contact_email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "ontime")
        return b.historical_ontime_rate - a.historical_ontime_rate;
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "last_order") {
        return (
          new Date(b.last_order_date || 0).getTime() -
          new Date(a.last_order_date || 0).getTime()
        );
      }
      return 0;
    });

    setFilteredSuppliers(result);
  }, [searchTerm, sortBy, suppliers]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add supplier");
      }

      const newSupplier = await response.json();

      // Enhance the new supplier with UI fields
      const enhancedSupplier = {
        ...newSupplier,
        status: newSupplier.preferred ? "Active" : "Inactive",
        components_supplied: 0, // New supplier starts with 0 components
        last_order_date: "Never",
      };

      setSuppliers((prev) => [...prev, enhancedSupplier]);
      setFormData({
        name: "",
        contact_email: "",
        phone: "",
        location: "",
        rating: 4,
        preferred: false,
      });
      onClose();

      toast({
        title: "Success",
        description: "Supplier added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add supplier",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/supplier/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }

      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));

      toast({
        title: "Success",
        description: "Supplier deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "gray";
      case "On Hold":
        return "orange";
      default:
        return "gray";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "green";
    if (rating >= 3.5) return "blue";
    if (rating >= 2.5) return "orange";
    return "red";
  };

  // Calculate metrics for the stats boxes
  const totalSuppliers = suppliers.length;
  const preferredSuppliers = suppliers.filter((s) => s.preferred).length;
  const avgRating = suppliers.length > 0 
    ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)
    : "0.0";
  const avgOnTimeRate = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.historical_ontime_rate, 0) / suppliers.length * 100).toFixed(1)
    : "0.0";
  const avgResponseTime = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.last_response_time, 0) / suppliers.length).toFixed(1)
    : "0.0";

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar isLoggedIn={true} />

        <Box flex="1" pt={20} px={6} bg="gray.50">
          <Flex direction="column" gap={6}>
            {/* Supplier Metrics at the top */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Total Suppliers</StatLabel>
                    <StatNumber>{totalSuppliers}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      5% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Preferred</StatLabel>
                    <StatNumber>{preferredSuppliers}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      12% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Avg. Rating</StatLabel>
                    <StatNumber>{avgRating}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      2% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Avg. On-Time Rate</StatLabel>
                    <StatNumber>{avgOnTimeRate}%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      3% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Flex direction={{ base: "column", lg: "row" }} gap={6}>
              {/* Main Content Area */}
              <Box flex={3} overflowX="auto">
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="xl" color="gray.800">
                    Supplier Management
                  </Heading>

                  <Button
                    colorScheme="brand"
                    leftIcon={<FiPlus />}
                    onClick={onOpen}
                  >
                    Add Supplier
                  </Button>
                </Flex>

                {/* Search and Filter Bar */}
                <Card mb={6} boxShadow="sm">
                  <CardBody>
                    <Flex gap={4} flexWrap="wrap">
                      <HStack flex={1} minW="300px">
                        <Icon as={FiSearch} color="gray.500" />
                        <Input
                          placeholder="Search suppliers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </HStack>

                      <HStack>
                        <Icon as={FiFilter} color="gray.500" />
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          minW="180px"
                        >
                          <option value="name">Sort by Name</option>
                          <option value="rating">Sort by Rating</option>
                          <option value="ontime">Sort by On-Time Rate</option>
                          <option value="status">Sort by Status</option>
                          <option value="last_order">Sort by Last Order</option>
                        </Select>
                      </HStack>

                      <Button leftIcon={<FiDownload />} variant="outline">
                        Export
                      </Button>
                      <Button leftIcon={<FiPrinter />} variant="outline">
                        Print
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Suppliers Table */}
                <Card boxShadow="sm">
                  {isLoading ? (
                    <CardBody>
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height="40px" mb={2} />
                      ))}
                    </CardBody>
                  ) : (
                    <>
                      <Table variant="striped" size="md">
                        <Thead>
                          <Tr>
                            <Th>Supplier</Th>
                            <Th>Contact</Th>
                            <Th>Location</Th>
                            <Th>Rating</Th>
                            <Th>On-Time Rate</Th>
                            <Th>Status</Th>
                            <Th>Last Order</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredSuppliers.map((supplier) => (
                            <Tr key={supplier.id}>
                              <Td>
                                <Flex align="center" gap={3}>
                                  <Avatar name={supplier.name} size="sm" />
                                  <Box>
                                    <Text fontWeight="medium">
                                      {supplier.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                      {supplier.components_supplied} components
                                    </Text>
                                  </Box>
                                  {supplier.preferred && (
                                    <Tag colorScheme="blue" size="sm">
                                      Preferred
                                    </Tag>
                                  )}
                                </Flex>
                              </Td>
                              <Td>
                                <VStack align="flex-start" spacing={0}>
                                  <HStack>
                                    <Icon
                                      as={FiMail}
                                      color="gray.500"
                                      size="14px"
                                    />
                                    <Text fontSize="sm">
                                      {supplier.contact_email}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Icon
                                      as={FiPhone}
                                      color="gray.500"
                                      size="14px"
                                    />
                                    <Text fontSize="sm">{supplier.phone}</Text>
                                  </HStack>
                                </VStack>
                              </Td>
                              <Td>
                                <HStack>
                                  <Icon
                                    as={FiGlobe}
                                    color="gray.500"
                                    size="14px"
                                  />
                                  <Text>{supplier.location}</Text>
                                </HStack>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={getRatingColor(supplier.rating)}
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  px={2}
                                  py={1}
                                  borderRadius="full"
                                >
                                  <Icon as={FiStar} />
                                  {supplier.rating.toFixed(1)}
                                </Badge>
                              </Td>
                              <Td>
                                <Flex align="center" gap={2}>
                                  <Progress
                                    value={supplier.historical_ontime_rate * 100}
                                    max={100}
                                    size="sm"
                                    colorScheme={
                                      supplier.historical_ontime_rate > 0.9
                                        ? "green"
                                        : supplier.historical_ontime_rate > 0.8
                                        ? "orange"
                                        : "red"
                                    }
                                    flex="1"
                                    borderRadius="full"
                                  />
                                  <Text
                                    fontSize="sm"
                                    minW="50px"
                                    textAlign="right"
                                  >
                                    {(
                                      supplier.historical_ontime_rate * 100
                                    ).toFixed(0)}
                                    %
                                  </Text>
                                </Flex>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={getStatusColor(supplier.status)}
                                  px={2}
                                  py={1}
                                  borderRadius="full"
                                >
                                  {supplier.status}
                                </Badge>
                              </Td>
                              <Td>
                                <HStack>
                                  <Icon
                                    as={FiCalendar}
                                    color="gray.500"
                                    size="14px"
                                  />
                                  <Text fontSize="sm">
                                    {supplier.last_order_date || "Never"}
                                  </Text>
                                </HStack>
                              </Td>
                              <Td>
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    aria-label="Actions"
                                    icon={<FiMoreVertical />}
                                    variant="ghost"
                                  />
                                  <MenuList>
                                    <MenuItem icon={<FiEdit2 />}>Edit</MenuItem>
                                    <MenuItem
                                      icon={<FiTrash2 />}
                                      color="red.500"
                                      onClick={() => handleDelete(supplier.id)}
                                    >
                                      Delete
                                    </MenuItem>
                                    <MenuItem icon={<FiArrowRight />}>
                                      View Details
                                    </MenuItem>
                                    <MenuItem icon={<FiDollarSign />}>
                                      Create PO
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>

                      {filteredSuppliers.length === 0 && !isLoading && (
                        <CardBody>
                          <Text textAlign="center" py={8} color="gray.500">
                            No suppliers found. Try adjusting your search.
                          </Text>
                        </CardBody>
                      )}
                    </>
                  )}
                </Card>
              </Box>

              {/* Sidebar */}
              <Box flex={1} minW="300px">
                <Card boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Supplier Performance</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Avg. On-Time Rate
                        </Text>
                        <Progress
                          value={parseFloat(avgOnTimeRate)}
                          max={100}
                          size="sm"
                          colorScheme="green"
                          borderRadius="full"
                        />
                      </Box>

                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Avg. Response Time
                        </Text>
                        <Progress
                          value={100 - (parseFloat(avgResponseTime) / 72 * 100)}
                          max={100}
                          size="sm"
                          colorScheme="blue"
                          borderRadius="full"
                        />
                        <Text fontSize="sm" mt={1} textAlign="right">
                          {avgResponseTime} hours
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <Button colorScheme="brand" w="full">
                      Supplier Performance Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card boxShadow="sm" mt={6}>
                  <CardHeader>
                    <Heading size="md">Quick Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <Button
                        leftIcon={<FiPlus />}
                        variant="outline"
                        onClick={onOpen}
                      >
                        Add Supplier
                      </Button>
                      <Button leftIcon={<FiDollarSign />} variant="outline">
                        Create Purchase Order
                      </Button>
                      <Button leftIcon={<FiDownload />} variant="outline">
                        Import Supplier List
                      </Button>
                      <Button leftIcon={<FiTruck />} variant="outline">
                        View Shipping Updates
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Footer />
      </Box>

      {/* Add Supplier Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Supplier</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Supplier Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Alpha Components"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Contact Email</FormLabel>
                  <Input
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="e.g., contact@supplier.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Shenzhen, China"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Initial Rating</FormLabel>
                  <Select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Below Average</option>
                    <option value={1}>1 - Poor</option>
                  </Select>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Preferred Supplier?</FormLabel>
                  <input
                    type="checkbox"
                    name="preferred"
                    checked={formData.preferred}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" type="submit">
                Add Supplier
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}