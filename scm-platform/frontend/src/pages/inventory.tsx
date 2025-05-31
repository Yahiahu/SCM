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

interface PurchaseOrder {
  id: number;
  status: "Draft" | "Ordered" | "Received";
  date_created: string;
  date_expected?: string;
  date_received?: string;
  supplier: {
    name: string;
  };
  createdBy: {
    username: string;
  };
  items: {
    component: {
      num: string;
      description: string;
    };
    ordered_qty: number;
    received_qty: number;
  }[];
}

interface ShippingInfo {
  id: number;
  status: "Processing" | "In Transit" | "Delivered" | "Delayed";
  estimated_arrival: string;
  carrier: string;
  tracking_number: string;
  origin: string;
  destination: string;
  component: {
    num: string;
    description: string;
  };
  qty: number;
}

interface WarehouseInventory {
  id: number;
  current_qty: number;
  incoming_qty: number;
  outgoing_qty: number;
  component: {
    num: string;
    description: string;
  };
  warehouse: {
    name: string;
    location: string;
  };
}

export default function LogisticsPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [shipments, setShipments] = useState<ShippingInfo[]>([]);
  const [inventory, setInventory] = useState<WarehouseInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    type: "order",
    componentId: "",
    quantity: "",
    supplierId: "",
    status: "Draft",
    carrier: "",
    trackingNumber: "",
    origin: "",
    destination: "",
    warehouseId: "",
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch purchase orders
        const poResponse = await fetch("/api/purchaseorder");
        if (!poResponse.ok) throw new Error("Failed to load purchase orders");
        const poData = await poResponse.json();

        // Fetch shipping info
        const shippingResponse = await fetch("/api/shippinginfo");
        if (!shippingResponse.ok) throw new Error("Failed to load shipments");
        const shippingData = await shippingResponse.json();

        // Fetch warehouse inventory
        const inventoryResponse = await fetch("/api/warehouseinventory");
        if (!inventoryResponse.ok) throw new Error("Failed to load inventory");
        const inventoryData = await inventoryResponse.json();

        setPurchaseOrders(poData);
        setShipments(shippingData);
        setInventory(inventoryData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.type === "order") {
        const response = await fetch("/api/purchase_order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplierId: parseInt(formData.supplierId),
            status: formData.status,
            items: [
              {
                componentId: parseInt(formData.componentId),
                ordered_qty: parseInt(formData.quantity),
                received_qty: 0,
              },
            ],
          }),
        });
        if (!response.ok) throw new Error("Failed to create purchase order");

        const newOrder = await response.json();
        setPurchaseOrders((prev) => [...prev, newOrder]);
      } else if (formData.type === "shipment") {
        const response = await fetch("/api/shipping_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            poId: 1, // You'll need to get this from context or form
            componentId: parseInt(formData.componentId),
            qty: parseInt(formData.quantity),
            origin: formData.origin,
            destination: formData.destination,
            carrier: formData.carrier,
            tracking_number: formData.trackingNumber,
            status: "Processing",
            estimated_arrival: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          }),
        });
        if (!response.ok) throw new Error("Failed to create shipment");

        const newShipment = await response.json();
        setShipments((prev) => [...prev, newShipment]);
      }

      toast({
        title: "Success",
        description: "Item added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        type: "order",
        componentId: "",
        quantity: "",
        supplierId: "",
        status: "Draft",
        carrier: "",
        trackingNumber: "",
        origin: "",
        destination: "",
        warehouseId: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add item",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
      case "Delivered":
        return "green";
      case "Ordered":
      case "In Transit":
        return "orange";
      case "Draft":
      case "Delayed":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Received":
      case "Delivered":
        return <Icon as={FiCheckCircle} />;
      case "Ordered":
      case "In Transit":
        return <Icon as={FiAlertTriangle} />;
      case "Draft":
      case "Delayed":
        return <Icon as={FiClock} />;
      default:
        return null;
    }
  };

  // Calculate inventory metrics
  const inventoryValue = inventory.reduce((sum, item) => {
    // Mock unit prices - in a real app, you'd fetch actual component costs
    const unitPrices: Record<string, number> = {
      "CMP-001-RES": 0.05,
      "CMP-002-CAP": 0.15,
      "CMP-003-BOLT": 0.25,
      "CMP-004-CASE": 5.2,
      "CMP-005-CPU": 15.75,
    };
    return sum + item.current_qty * (unitPrices[item.component.num] || 10);
  }, 0);

  const itemsNeedingReorder = inventory.filter(
    (item) => item.current_qty < 10 // Simple threshold for demo
  ).length;

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />

      <Box pt={20} px={6} bg="gray.50" minH="calc(100vh - 128px)">
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
                  {
                    purchaseOrders.filter((po) => po.status === "Ordered")
                      .length
                  }
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
                  {shipments.filter((s) => s.status === "In Transit").length}
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
          {/* Purchase Orders Table */}
          <Card boxShadow="sm">
            <CardHeader bg="brand.500" borderTopRadius="md">
              <HStack>
                <Icon as={FiPackage} color="white" />
                <Heading size="md" color="white">
                  Purchase Orders
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
                      <Th>PO #</Th>
                      <Th>Supplier</Th>
                      <Th>Status</Th>
                      <Th>Expected</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {purchaseOrders.slice(0, 5).map((po) => (
                      <Tr key={po.id}>
                        <Td fontWeight="medium">{po.id}</Td>
                        <Td>{po.supplier?.name || "N/A"}</Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(po.status)}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {getStatusIcon(po.status)}
                            {po.status}
                          </Badge>
                        </Td>
                        <Td>{po.date_expected || "N/A"}</Td>
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
                      <Th>Component</Th>
                      <Th>Destination</Th>
                      <Th>Status</Th>
                      <Th>ETA</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {shipments.slice(0, 5).map((shipment) => (
                      <Tr key={shipment.id}>
                        <Td>{shipment.component?.num || "N/A"}</Td>
                        <Td>{shipment.destination}</Td>
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
                        <Td>{shipment.estimated_arrival}</Td>
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
                      <Th>Component</Th>
                      <Th>Warehouse</Th>
                      <Th isNumeric>Qty</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {inventory.slice(0, 5).map((item) => (
                      <Tr key={item.id}>
                        <Td>{item.component?.num || "N/A"}</Td>
                        <Td>{item.warehouse?.name || "N/A"}</Td>
                        <Td isNumeric>{item.current_qty}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              item.current_qty > 20
                                ? "green"
                                : item.current_qty > 0
                                ? "orange"
                                : "red"
                            }
                            display="flex"
                            alignItems="center"
                            gap={1}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {getStatusIcon(
                              item.current_qty > 20
                                ? "In Stock"
                                : item.current_qty > 0
                                ? "Low Stock"
                                : "Out of Stock"
                            )}
                            {item.current_qty > 20
                              ? "In Stock"
                              : item.current_qty > 0
                              ? "Low Stock"
                              : "Out of Stock"}
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
              {inventory.filter((item) => item.current_qty < 10).length > 0 ? (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Component</Th>
                      <Th isNumeric>Current</Th>
                      <Th>Warehouse</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {inventory
                      .filter((item) => item.current_qty < 10)
                      .map((item) => (
                        <Tr key={item.id}>
                          <Td>{item.component?.num || "N/A"}</Td>
                          <Td
                            isNumeric
                            color={
                              item.current_qty === 0 ? "red.500" : "orange.500"
                            }
                          >
                            {item.current_qty}
                          </Td>
                          <Td>{item.warehouse?.name || "N/A"}</Td>
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
                  <Text fontSize="sm">
                    •{" "}
                    {
                      purchaseOrders.filter(
                        (po) =>
                          new Date(po.date_created).toDateString() ===
                          new Date().toDateString()
                      ).length
                    }{" "}
                    new orders created
                  </Text>
                  <Text fontSize="sm">
                    • {shipments.filter((s) => s.status === "Delivered").length}{" "}
                    shipments delivered
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Yesterday</Text>
                  <Text fontSize="sm">
                    •{" "}
                    {
                      inventory.filter(
                        (i) =>
                          new Date().getDate() - new Date(i.id).getDate() === 1
                      ).length
                    }{" "}
                    inventory updates
                  </Text>
                  <Text fontSize="sm">
                    • {shipments.filter((s) => s.status === "Delayed").length}{" "}
                    delayed shipments
                  </Text>
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
                    <option value="order">Purchase Order</option>
                    <option value="shipment">Shipment</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Component</FormLabel>
                  <Select
                    name="componentId"
                    value={formData.componentId}
                    onChange={handleInputChange}
                    placeholder="Select component"
                  >
                    {/* In a real app, you'd fetch components from your API */}
                    <option value="1">CMP-001-RES (Resistor)</option>
                    <option value="2">CMP-002-CAP (Capacitor)</option>
                    <option value="3">CMP-003-BOLT (Bolt)</option>
                    <option value="4">CMP-004-CASE (Case)</option>
                    <option value="5">CMP-005-CPU (CPU)</option>
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

                {formData.type === "order" && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Supplier</FormLabel>
                      <Select
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleInputChange}
                        placeholder="Select supplier"
                      >
                        <option value="1">Alpha Components</option>
                        <option value="2">Beta Electronics</option>
                        <option value="3">Gamma Mechanical</option>
                        <option value="4">Delta Materials</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Status</FormLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Ordered">Ordered</option>
                      </Select>
                    </FormControl>
                  </>
                )}

                {formData.type === "shipment" && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Origin</FormLabel>
                      <Input
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        placeholder="Origin location"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Destination</FormLabel>
                      <Input
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="Destination"
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
                    <FormControl>
                      <FormLabel>Tracking Number</FormLabel>
                      <Input
                        name="trackingNumber"
                        value={formData.trackingNumber}
                        onChange={handleInputChange}
                        placeholder="Tracking number"
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
