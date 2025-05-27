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
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiDownload,
  FiPrinter,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiArrowRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";

// Custom theme with blue color scheme
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

interface Component {
  id: string;
  name: string;
  type: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  supplier: string;
  lastUpdated: string;
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    supplier: "",
  });

  // Fetch components (simulated)
  useEffect(() => {
    const fetchComponents = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data - replace with actual API call
        const mockData: Component[] = [
          {
            id: "1",
            name: "Capacitor 100μF",
            type: "Electrical",
            quantity: 500,
            status: "In Stock",
            supplier: "Alpha Components",
            lastUpdated: "2023-05-15",
          },
          {
            id: "2",
            name: "Gear 20T",
            type: "Mechanical",
            quantity: 8,
            status: "Low Stock",
            supplier: "Gamma Mechanical",
            lastUpdated: "2023-05-10",
          },
          {
            id: "3",
            name: "M3 Screw 10mm",
            type: "Hardware",
            quantity: 1200,
            status: "In Stock",
            supplier: "Delta Materials",
            lastUpdated: "2023-05-12",
          },
          {
            id: "4",
            name: "Microcontroller ARM",
            type: "Electronics",
            quantity: 0,
            status: "Out of Stock",
            supplier: "Beta Electronics",
            lastUpdated: "2023-05-01",
          },
          {
            id: "5",
            name: "Plastic Enclosure",
            type: "Housing",
            quantity: 45,
            status: "In Stock",
            supplier: "Delta Materials",
            lastUpdated: "2023-05-14",
          },
        ];

        setComponents(mockData);
        setFilteredComponents(mockData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load components",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Filter and sort components
  useEffect(() => {
    let result = [...components];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (comp) =>
          comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "quantity") return b.quantity - a.quantity;
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });

    setFilteredComponents(result);
  }, [searchTerm, sortBy, components]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding a new component
    const newComponent: Component = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      type: formData.type,
      quantity: parseInt(formData.quantity),
      status:
        parseInt(formData.quantity) > 10
          ? "In Stock"
          : parseInt(formData.quantity) > 0
          ? "Low Stock"
          : "Out of Stock",
      supplier: formData.supplier,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setComponents((prev) => [...prev, newComponent]);
    setFormData({
      name: "",
      type: "",
      quantity: "",
      supplier: "",
    });
    onClose();

    toast({
      title: "Success",
      description: "Component added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Icon as={FiCheckCircle} color="green.500" />;
      case "Low Stock":
        return <Icon as={FiAlertTriangle} color="orange.500" />;
      case "Out of Stock":
        return <Icon as={FiClock} color="red.500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "green";
      case "Low Stock":
        return "orange";
      case "Out of Stock":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />

      <Box pt = {20} px={6} bg="gray.50" minH="calc(100vh - 128px)">
        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Main Content Area */}
          <Box flex={3}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="xl" color="gray.800">
                Component Inventory
              </Heading>

              <Button
                colorScheme="brand"
                leftIcon={<FiPlus />}
                onClick={onOpen}
              >
                Add Component
              </Button>
            </Flex>

            {/* Search and Filter Bar */}
            <Card mb={6} boxShadow="sm">
              <CardBody>
                <Flex gap={4} flexWrap="wrap">
                  <HStack flex={1} minW="300px">
                    <Icon as={FiSearch} color="gray.500" />
                    <Input
                      placeholder="Search components..."
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
                      <option value="type">Sort by Type</option>
                      <option value="quantity">Sort by Quantity</option>
                      <option value="status">Sort by Status</option>
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

            {/* Components Table */}
            <Card boxShadow="sm" overflowX="auto">
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
                        <Th>Component</Th>
                        <Th>Type</Th>
                        <Th>Quantity</Th>
                        <Th>Status</Th>
                        <Th>Supplier</Th>
                        <Th>Last Updated</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredComponents.map((component) => (
                        <Tr key={component.id}>
                          <Td fontWeight="medium">{component.name}</Td>
                          <Td>{component.type}</Td>
                          <Td>
                            <Flex align="center" gap={2}>
                              {component.quantity}
                              <Progress
                                value={Math.min(component.quantity, 100)}
                                max={100}
                                size="xs"
                                colorScheme={getStatusColor(component.status)}
                                flex="1"
                                borderRadius="full"
                              />
                            </Flex>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusColor(component.status)}
                              display="flex"
                              alignItems="center"
                              gap={1}
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              {getStatusIcon(component.status)}
                              {component.status}
                            </Badge>
                          </Td>
                          <Td>{component.supplier}</Td>
                          <Td>{component.lastUpdated}</Td>
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
                                <MenuItem icon={<FiTrash2 />} color="red.500">
                                  Delete
                                </MenuItem>
                                <MenuItem icon={<FiArrowRight />}>
                                  View Details
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  {filteredComponents.length === 0 && (
                    <CardBody>
                      <Text textAlign="center" py={8} color="gray.500">
                        No components found. Try adjusting your search.
                      </Text>
                    </CardBody>
                  )}
                </>
              )}
            </Card>
          </Box>

          {/* Sidebar */}
          <Box flex={1} minW="300px">
            <Card boxShadow="sm" mb={6}>
              <CardHeader>
                <Heading size="md">Inventory Summary</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Total Components
                    </Text>
                    <Heading size="lg">{components.length}</Heading>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      In Stock
                    </Text>
                    <Heading size="lg">
                      {components.filter((c) => c.status === "In Stock").length}
                    </Heading>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Low Stock
                    </Text>
                    <Heading size="lg" color="orange.500">
                      {
                        components.filter((c) => c.status === "Low Stock")
                          .length
                      }
                    </Heading>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Out of Stock
                    </Text>
                    <Heading size="lg" color="red.500">
                      {
                        components.filter((c) => c.status === "Out of Stock")
                          .length
                      }
                    </Heading>
                  </Box>
                </VStack>
              </CardBody>
              <CardFooter>
                <Button colorScheme="brand" w="full">
                  Generate Report
                </Button>
              </CardFooter>
            </Card>

            <Card boxShadow="sm">
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
                    Add Component
                  </Button>
                  <Button leftIcon={<FiDownload />} variant="outline">
                    Import Components
                  </Button>
                  <Button leftIcon={<FiPrinter />} variant="outline">
                    Print Labels
                  </Button>
                  <Button leftIcon={<FiArrowRight />} variant="outline">
                    View Suppliers
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Box>

      <Footer />

      {/* Add Component Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Component</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Component Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Capacitor 100μF"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="Select type"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Housing">Housing</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Supplier</FormLabel>
                  <Input
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Optional supplier name"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" type="submit">
                Save Component
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
