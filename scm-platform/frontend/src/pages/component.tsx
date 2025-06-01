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
  num: string;
  description: string;
  notes?: string;
  supplierPartNumber: string;
  supplierId: number;
  currentQty: number;
  status?: "In Stock" | "Low Stock" | "Out of Stock";
  type?: string;
  supplier?: string;
  lastUpdated?: string;
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
    num: "",
    description: "",
    notes: "",
    supplierPartNumber: "",
    supplierId: 1, // Default supplier ID
  });

  // Fetch components from API
  useEffect(() => {
    const fetchComponents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/component");
        if (!response.ok) {
          throw new Error("Failed to load components");
        }
        const data = await response.json();

        // Enhance components with additional UI fields
        const enhancedComponents = data.map((comp: any) => ({
          ...comp,
          currentQty: comp.warehouse_inventories?.[0]?.current_qty || 0,
          type: getComponentType(comp.description),
          supplier: getSupplierName(comp.supplierId),
          lastUpdated: new Date().toISOString().split("T")[0], // Mock date
          status: getStatus(comp.warehouse_inventories?.[0]?.current_qty || 0),
        }));

        setComponents(enhancedComponents);
        setFilteredComponents(enhancedComponents);
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
  }, [toast]);

  // Helper functions
  const getSupplierName = (supplierId: number) => {
    const suppliers = [
      { id: 1, name: "Alpha Components" },
      { id: 2, name: "Beta Electronics" },
      { id: 3, name: "Gamma Mechanical" },
      { id: 4, name: "Delta Materials" },
    ];
    return suppliers.find((s) => s.id === supplierId)?.name || "Unknown Supplier";
  };

  const getComponentType = (description: string) => {
    if (description.includes("Resistor")) return "Electrical";
    if (description.includes("Capacitor")) return "Electrical";
    if (description.includes("Bolt")) return "Hardware";
    if (description.includes("CPU")) return "Electronics";
    if (description.includes("Case")) return "Housing";
    return "Other";
  };

  const getStatus = (quantity: number): "In Stock" | "Low Stock" | "Out of Stock" => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= 10) return "Low Stock";
    return "In Stock";
  };

  // Filter and sort components
  useEffect(() => {
    let result = [...components];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (comp) =>
          comp.num.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (comp.supplier && comp.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.num.localeCompare(b.num);
      if (sortBy === "type") return (a.type || "").localeCompare(b.type || "");
      if (sortBy === "quantity") return b.currentQty - a.currentQty;
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

    setFilteredComponents(result);
  }, [searchTerm, sortBy, components]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/component", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add component");
      }

      const newComponent = await response.json();

      // Enhance the new component with UI fields
      const enhancedComponent = {
        ...newComponent,
        currentQty: 0, // New component starts with 0 quantity
        type: getComponentType(newComponent.description),
        supplier: getSupplierName(newComponent.supplierId),
        lastUpdated: new Date().toISOString().split("T")[0],
        status: "Out of Stock",
      };

      setComponents((prev) => [...prev, enhancedComponent]);
      setFormData({
        num: "",
        description: "",
        notes: "",
        supplierPartNumber: "",
        supplierId: 1,
      });
      onClose();

      toast({
        title: "Success",
        description: "Component added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add component",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/component/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete component");
      }

      setComponents((prev) => prev.filter((comp) => comp.id !== id));

      toast({
        title: "Success",
        description: "Component deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete component",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar isLoggedIn={true} />
        
        <Box flex="1" pt={20} px={6} bg="gray.50">
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
                        <option value="name">Sort by Part Number</option>
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
                          <Th>Part Number</Th>
                          <Th>Description</Th>
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
                            <Td fontWeight="medium">{component.num}</Td>
                            <Td>{component.description}</Td>
                            <Td>{component.type || "N/A"}</Td>
                            <Td>
                              <Flex align="center" gap={2}>
                                {component.currentQty}
                                <Progress
                                  value={Math.min(component.currentQty, 100)}
                                  max={100}
                                  size="xs"
                                  colorScheme={getStatusColor(component.status || "")}
                                  flex="1"
                                  borderRadius="full"
                                />
                              </Flex>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={getStatusColor(component.status || "")}
                                display="flex"
                                alignItems="center"
                                gap={1}
                                px={2}
                                py={1}
                                borderRadius="full"
                              >
                                {getStatusIcon(component.status || "")}
                                {component.status}
                              </Badge>
                            </Td>
                            <Td>{component.supplier || "N/A"}</Td>
                            <Td>{component.lastUpdated || "N/A"}</Td>
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
                                    onClick={() => handleDelete(component.id)}
                                  >
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

                    {filteredComponents.length === 0 && !isLoading && (
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
                        {components.filter((c) => c.status === "Low Stock").length}
                      </Heading>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Out of Stock
                      </Text>
                      <Heading size="lg" color="red.500">
                        {components.filter((c) => c.status === "Out of Stock").length}
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
      </Box>

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
                  <FormLabel>Part Number</FormLabel>
                  <Input
                    name="num"
                    value={formData.num}
                    onChange={handleInputChange}
                    placeholder="e.g., CMP-001-RES"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g., Resistor 10k Ohm 1/4W"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Supplier Part Number</FormLabel>
                  <Input
                    name="supplierPartNumber"
                    value={formData.supplierPartNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., ALPHA-RES-10K"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Supplier</FormLabel>
                  <Select
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                  >
                    <option value={1}>Alpha Components</option>
                    <option value={2}>Beta Electronics</option>
                    <option value={3}>Gamma Mechanical</option>
                    <option value={4}>Delta Materials</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes"
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