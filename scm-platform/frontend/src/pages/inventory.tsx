"use client";

import {
  Box,
  ChakraProvider,
  extendTheme,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  VStack,
  Image,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Progress,
  HStack,
  Icon,
  Button,
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
  Input,
  Select,
  useToast,
  Skeleton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Spacer,
  SimpleGrid,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import {
  FiTruck,
  FiPackage,
  FiHome,
  FiGlobe,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiTrendingUp,
  FiAlertCircle,
  FiBox,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import React, { useState, useEffect } from "react";

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

interface OrderedItem {
  id: string;
  item: string;
  quantity: number;
  customer: string;
  dateOrdered: string;
  status: "Pending" | "Processing" | "Completed";
}

interface ShippedItem {
  id: string;
  item: string;
  quantity: number;
  destination: string;
  status: "In Transit" | "Delivered" | "Delayed";
  estimatedArrival: string;
  carrier: string;
}

interface WarehousedItem {
  id: string;
  item: string;
  quantity: number;
  location: string;
  lastStocked: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  reorderLevel: number;
}

export default function LogisticsPage() {
  const [orderedItems, setOrderedItems] = useState<OrderedItem[]>([]);
  const [shippedItems, setShippedItems] = useState<ShippedItem[]>([]);
  const [warehousedItems, setWarehousedItems] = useState<WarehousedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    type: "order",
    item: "",
    quantity: "",
    customer: "",
    destination: "",
    location: "",
    carrier: "",
    reorderLevel: "",
  });

  // Fetch data (simulated)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data - replace with actual API calls
        setOrderedItems([
          {
            id: "ORD001",
            item: "Sensor Unit X",
            quantity: 50,
            customer: "Tech Solutions Ltd.",
            dateOrdered: "2024-05-15",
            status: "Processing",
          },
          {
            id: "ORD002",
            item: "Actuator Arm Y",
            quantity: 25,
            customer: "Robotics Inc.",
            dateOrdered: "2024-05-18",
            status: "Pending",
          },
          {
            id: "ORD003",
            item: "Control Panel Z",
            quantity: 10,
            customer: "Automate Corp.",
            dateOrdered: "2024-05-20",
            status: "Completed",
          },
        ]);

        setShippedItems([
          {
            id: "SHP001",
            item: "Sensor Unit X",
            quantity: 50,
            destination: "New York Hub",
            status: "In Transit",
            estimatedArrival: "2024-06-01",
            carrier: "FedEx",
          },
          {
            id: "SHP002",
            item: "Actuator Arm Y",
            quantity: 20,
            destination: "London Depot",
            status: "Delivered",
            estimatedArrival: "2024-05-25",
            carrier: "DHL",
          },
          {
            id: "SHP003",
            item: "Component A",
            quantity: 100,
            destination: "Tokyo Warehouse",
            status: "Delayed",
            estimatedArrival: "2024-06-10",
            carrier: "UPS",
          },
        ]);

        setWarehousedItems([
          {
            id: "WH001",
            item: "Component A",
            quantity: 500,
            location: "Shelf A1",
            lastStocked: "2024-05-15",
            status: "In Stock",
            reorderLevel: 100,
          },
          {
            id: "WH002",
            item: "Part B",
            quantity: 8,
            location: "Bay B3",
            lastStocked: "2024-05-18",
            status: "Low Stock",
            reorderLevel: 20,
          },
          {
            id: "WH003",
            item: "Sub-assembly C",
            quantity: 0,
            location: "Rack C2",
            lastStocked: "2024-05-20",
            status: "Out of Stock",
            reorderLevel: 50,
          },
          {
            id: "WH004",
            item: "Microcontroller",
            quantity: 35,
            location: "Bin D4",
            lastStocked: "2024-05-22",
            status: "In Stock",
            reorderLevel: 30,
          },
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load logistics data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding new item
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();

    if (formData.type === "order") {
      const newOrder: OrderedItem = {
        id: `ORD${newId}`,
        item: formData.item,
        quantity: parseInt(formData.quantity),
        customer: formData.customer,
        dateOrdered: new Date().toISOString().split("T")[0],
        status: "Pending",
      };
      setOrderedItems((prev) => [...prev, newOrder]);
    } else if (formData.type === "shipment") {
      const newShipment: ShippedItem = {
        id: `SHP${newId}`,
        item: formData.item,
        quantity: parseInt(formData.quantity),
        destination: formData.destination,
        status: "In Transit",
        estimatedArrival: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        carrier: formData.carrier,
      };
      setShippedItems((prev) => [...prev, newShipment]);
    } else {
      const newWarehouseItem: WarehousedItem = {
        id: `WH${newId}`,
        item: formData.item,
        quantity: parseInt(formData.quantity),
        location: formData.location,
        lastStocked: new Date().toISOString().split("T")[0],
        status:
          parseInt(formData.quantity) > 10
            ? "In Stock"
            : parseInt(formData.quantity) > 0
            ? "Low Stock"
            : "Out of Stock",
        reorderLevel: parseInt(formData.reorderLevel) || 0,
      };
      setWarehousedItems((prev) => [...prev, newWarehouseItem]);
    }

    setFormData({
      type: "order",
      item: "",
      quantity: "",
      customer: "",
      destination: "",
      location: "",
      carrier: "",
      reorderLevel: "",
    });
    onClose();

    toast({
      title: "Success",
      description: "Item added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Delivered":
      case "In Stock":
        return "green";
      case "Processing":
      case "In Transit":
      case "Low Stock":
        return "orange";
      case "Pending":
      case "Delayed":
      case "Out of Stock":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "Delivered":
      case "In Stock":
        return <Icon as={FiCheckCircle} />;
      case "Processing":
      case "In Transit":
      case "Low Stock":
        return <Icon as={FiAlertTriangle} />;
      case "Pending":
      case "Delayed":
      case "Out of Stock":
        return <Icon as={FiClock} />;
      default:
        return null;
    }
  };

  // Calculate inventory metrics
  const inventoryValue = warehousedItems.reduce((sum, item) => {
    // Mock unit prices - replace with actual data
    const unitPrices: Record<string, number> = {
      "Component A": 12.5,
      "Part B": 8.75,
      "Sub-assembly C": 45.0,
      Microcontroller: 22.3,
    };
    return sum + item.quantity * (unitPrices[item.item] || 10);
  }, 0);

  const itemsNeedingReorder = warehousedItems.filter(
    (item) => item.quantity <= item.reorderLevel
  ).length;

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />

      <Box pt = {20} px={6} bg="gray.50" minH="calc(100vh - 128px)">
        {/* Header and Stats */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="xl" color="gray.800">
            Logistics Dashboard
          </Heading>

          <Button colorScheme="brand" leftIcon={<FiPlus />} onClick={onOpen}>
            Add Item
          </Button>
        </Flex>

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Inventory Value</StatLabel>
                <StatNumber>${inventoryValue.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Orders</StatLabel>
                <StatNumber>
                  {orderedItems.filter((o) => o.status === "Pending").length}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  5% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Items Needing Reorder</StatLabel>
                <StatNumber
                  color={itemsNeedingReorder > 0 ? "orange.500" : "green.500"}
                >
                  {itemsNeedingReorder}
                </StatNumber>
                <StatHelpText>
                  {itemsNeedingReorder > 0 ? (
                    <HStack color="orange.500">
                      <Icon as={FiAlertCircle} />
                      <Text>Action needed</Text>
                    </HStack>
                  ) : (
                    <HStack color="green.500">
                      <Icon as={FiCheckCircle} />
                      <Text>All stocked</Text>
                    </HStack>
                  )}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>In Transit Shipments</StatLabel>
                <StatNumber>
                  {shippedItems.filter((s) => s.status === "In Transit").length}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />3 new shipments today
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Three Tables Layout */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>
          {/* Orders Table */}
          <Card boxShadow="sm">
            <CardHeader bg="brand.500" borderTopRadius="md">
              <HStack>
                <Icon as={FiPackage} color="white" />
                <Heading size="md" color="white">
                  Orders
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody p={0}>
              {isLoading ? (
                <Box p={6}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} height="40px" mb={2} />
                  ))}
                </Box>
              ) : (
                <Table variant="striped" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Item</Th>
                      <Th isNumeric>Qty</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orderedItems.map((order) => (
                      <Tr key={order.id}>
                        <Td fontWeight="medium">{order.id}</Td>
                        <Td>{order.item}</Td>
                        <Td isNumeric>{order.quantity}</Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(order.status)}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
            <CardFooter>
              <Button variant="link" colorScheme="brand">
                View all orders
              </Button>
            </CardFooter>
          </Card>

          {/* Shipments Table */}
          <Card boxShadow="sm">
            <CardHeader bg="brand.600" borderTopRadius="md">
              <HStack>
                <Icon as={FiTruck} color="white" />
                <Heading size="md" color="white">
                  Shipments
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody p={0}>
              {isLoading ? (
                <Box p={6}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} height="40px" mb={2} />
                  ))}
                </Box>
              ) : (
                <Table variant="striped" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Ship ID</Th>
                      <Th>Destination</Th>
                      <Th isNumeric>Qty</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {shippedItems.map((shipment) => (
                      <Tr key={shipment.id}>
                        <Td fontWeight="medium">{shipment.id}</Td>
                        <Td>{shipment.destination}</Td>
                        <Td isNumeric>{shipment.quantity}</Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(shipment.status)}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {getStatusIcon(shipment.status)}
                            {shipment.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
            <CardFooter>
              <Button variant="link" colorScheme="brand">
                Track all shipments
              </Button>
            </CardFooter>
          </Card>

          {/* Warehouse Table */}
          <Card boxShadow="sm">
            <CardHeader bg="brand.700" borderTopRadius="md">
              <HStack>
                <Icon as={FiHome} color="white" />
                <Heading size="md" color="white">
                  Warehouse
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody p={0}>
              {isLoading ? (
                <Box p={6}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} height="40px" mb={2} />
                  ))}
                </Box>
              ) : (
                <Table variant="striped" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Item</Th>
                      <Th isNumeric>Qty</Th>
                      <Th>Location</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {warehousedItems.map((item) => (
                      <Tr key={item.id}>
                        <Td>{item.item}</Td>
                        <Td isNumeric>
                          <Flex direction="column">
                            {item.quantity}
                            <Text fontSize="xs" color="gray.500">
                              Reorder: {item.reorderLevel}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>{item.location}</Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(item.status)}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {getStatusIcon(item.status)}
                            {item.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
            <CardFooter>
              <Button variant="link" colorScheme="brand">
                View full inventory
              </Button>
            </CardFooter>
          </Card>
        </SimpleGrid>

        {/* Additional Inventory Features */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Reorder Alerts */}
          <Card boxShadow="sm">
            <CardHeader bg="orange.50">
              <HStack>
                <Icon as={FiAlertTriangle} color="orange.500" />
                <Heading size="md">Reorder Alerts</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              {warehousedItems.filter(
                (item) => item.quantity <= item.reorderLevel
              ).length > 0 ? (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Item</Th>
                      <Th isNumeric>Current</Th>
                      <Th isNumeric>Reorder At</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {warehousedItems
                      .filter((item) => item.quantity <= item.reorderLevel)
                      .map((item) => (
                        <Tr key={item.id}>
                          <Td>{item.item}</Td>
                          <Td
                            isNumeric
                            color={
                              item.quantity === 0 ? "red.500" : "orange.500"
                            }
                          >
                            {item.quantity}
                          </Td>
                          <Td isNumeric>{item.reorderLevel}</Td>
                          <Td>
                            <Button size="xs" colorScheme="orange">
                              Create PO
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              ) : (
                <Text color="green.500" textAlign="center" py={4}>
                  <Icon as={FiCheckCircle} mr={2} />
                  No reorder alerts at this time
                </Text>
              )}
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card boxShadow="sm">
            <CardHeader bg="blue.50">
              <HStack>
                <Icon as={FiTrendingUp} color="blue.500" />
                <Heading size="md">Recent Activity</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Today</Text>
                  <Text fontSize="sm">• 3 new orders received</Text>
                  <Text fontSize="sm">• 2 shipments marked as delivered</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Yesterday</Text>
                  <Text fontSize="sm">
                    • Inventory count completed for Section A
                  </Text>
                  <Text fontSize="sm">• 1 delayed shipment updated</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Footer />

      {/* Add Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Logistics Item</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Item Type</FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="order">Order</option>
                    <option value="shipment">Shipment</option>
                    <option value="warehouse">Warehouse Item</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    name="item"
                    value={formData.item}
                    onChange={handleInputChange}
                    placeholder="e.g., Sensor Unit X"
                  />
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

                {formData.type === "order" && (
                  <FormControl isRequired>
                    <FormLabel>Customer</FormLabel>
                    <Input
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      placeholder="Customer name"
                    />
                  </FormControl>
                )}

                {formData.type === "shipment" && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Destination</FormLabel>
                      <Input
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="Destination address"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Carrier</FormLabel>
                      <Select
                        name="carrier"
                        value={formData.carrier}
                        onChange={handleInputChange}
                        placeholder="Select carrier"
                      >
                        <option value="FedEx">FedEx</option>
                        <option value="UPS">UPS</option>
                        <option value="DHL">DHL</option>
                        <option value="USPS">USPS</option>
                      </Select>
                    </FormControl>
                  </>
                )}

                {formData.type === "warehouse" && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Location</FormLabel>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Shelf A1"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Reorder Level</FormLabel>
                      <Input
                        name="reorderLevel"
                        type="number"
                        value={formData.reorderLevel}
                        onChange={handleInputChange}
                        placeholder="Set reorder threshold"
                      />
                    </FormControl>
                  </>
                )}
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" type="submit">
                Add Item
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
