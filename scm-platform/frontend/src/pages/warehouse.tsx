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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  HStack,
  Icon,
  Input,
  Button,
  Select,
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
  useToast,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Divider,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tag,
  Avatar,
  AvatarGroup,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiPackage,
  FiHome,
  FiTrendingUp,
  FiAlertCircle,
  FiBox,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState } from "react";

// Custom theme for warehouse dashboard
const theme = extendTheme({
  colors: {
    warehouse: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
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
          bg: "warehouse.500",
          color: "white",
          _hover: {
            bg: "warehouse.600",
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
                  background: "warehouse.50",
                },
              },
            },
          },
        },
      },
    },
  },
});

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  minStockLevel: number;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Backordered";
  lastUpdated: string;
  image?: string;
}

interface IncomingShipment {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  from: string;
  expectedDate: string;
  status: "In Transit" | "Delayed" | "Arrived";
  carrier: string;
}

interface OutgoingShipment {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  to: string;
  orderNumber: string;
  status: "Processing" | "Shipped" | "Delivered";
  shippingDate: string;
}

export default function WarehousePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "INV001",
      sku: "WGT-A-001",
      name: "Widget A",
      category: "Components",
      location: "Bay 1, Shelf 2",
      quantity: 150,
      minStockLevel: 50,
      status: "In Stock",
      lastUpdated: "2024-05-20",
      image: "https://via.placeholder.com/50",
    },
    {
      id: "INV002",
      sku: "GDT-B-002",
      name: "Gadget B",
      category: "Assemblies",
      location: "Bay 3, Shelf 1",
      quantity: 89,
      minStockLevel: 100,
      status: "Low Stock",
      lastUpdated: "2024-05-22",
      image: "https://via.placeholder.com/50",
    },
    {
      id: "INV003",
      sku: "PRT-C-003",
      name: "Part C",
      category: "Hardware",
      location: "Bay 2, Shelf 3",
      quantity: 240,
      minStockLevel: 75,
      status: "In Stock",
      lastUpdated: "2024-05-18",
      image: "https://via.placeholder.com/50",
    },
    {
      id: "INV004",
      sku: "MTR-D-004",
      name: "Motor D",
      category: "Electromechanical",
      location: "Bay 4, Shelf 1",
      quantity: 0,
      minStockLevel: 10,
      status: "Out of Stock",
      lastUpdated: "2024-05-15",
      image: "https://via.placeholder.com/50",
    },
    {
      id: "INV005",
      sku: "SNS-E-005",
      name: "Sensor E",
      category: "Electronics",
      location: "Bay 1, Shelf 4",
      quantity: 12,
      minStockLevel: 25,
      status: "Low Stock",
      lastUpdated: "2024-05-24",
      image: "https://via.placeholder.com/50",
    },
  ]);

  const [incoming, setIncoming] = useState<IncomingShipment[]>([
    {
      id: "INC001",
      itemId: "INV002",
      itemName: "Gadget B",
      quantity: 50,
      from: "Montreal Supplier",
      expectedDate: "2024-05-28",
      status: "In Transit",
      carrier: "FedEx",
    },
    {
      id: "INC002",
      itemId: "INV001",
      itemName: "Widget A",
      quantity: 30,
      from: "Calgary Distributor",
      expectedDate: "2024-05-30",
      status: "In Transit",
      carrier: "UPS",
    },
    {
      id: "INC003",
      itemId: "INV004",
      itemName: "Motor D",
      quantity: 15,
      from: "Toronto Wholesale",
      expectedDate: "2024-05-25",
      status: "Delayed",
      carrier: "DHL",
    },
  ]);

  const [outgoing, setOutgoing] = useState<OutgoingShipment[]>([
    {
      id: "OUT001",
      itemId: "INV001",
      itemName: "Widget A",
      quantity: 20,
      to: "Toronto Customer",
      orderNumber: "ORD-2024-105",
      status: "Shipped",
      shippingDate: "2024-05-22",
    },
    {
      id: "OUT002",
      itemId: "INV003",
      itemName: "Part C",
      quantity: 10,
      to: "Vancouver Client",
      orderNumber: "ORD-2024-106",
      status: "Processing",
      shippingDate: "2024-05-24",
    },
    {
      id: "OUT003",
      itemId: "INV002",
      itemName: "Gadget B",
      quantity: 5,
      to: "Ottawa Partner",
      orderNumber: "ORD-2024-107",
      status: "Delivered",
      shippingDate: "2024-05-18",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    location: "",
    quantity: "",
    minStockLevel: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INV${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const sku =
      formData.sku ||
      `${formData.name.substring(0, 3).toUpperCase()}-${formData.category
        .substring(0, 1)
        .toUpperCase()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

    const quantity = parseInt(formData.quantity) || 0;
    const minStockLevel = parseInt(formData.minStockLevel) || 0;

    let status: InventoryItem["status"] = "In Stock";
    if (quantity === 0) status = "Out of Stock";
    else if (quantity <= minStockLevel) status = "Low Stock";

    const newItem: InventoryItem = {
      id: newId,
      sku,
      name: formData.name,
      category: formData.category,
      location: formData.location,
      quantity,
      minStockLevel,
      status,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setInventory((prev) => [...prev, newItem]);
    setFormData({
      name: "",
      sku: "",
      category: "",
      location: "",
      quantity: "",
      minStockLevel: "",
    });
    onClose();

    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to inventory`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item Deleted",
      description: "The item has been removed from inventory",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const updateItemQuantity = (id: string, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let status = item.status;
          if (newQuantity === 0) status = "Out of Stock";
          else if (newQuantity <= item.minStockLevel) status = "Low Stock";
          else status = "In Stock";

          return {
            ...item,
            quantity: newQuantity,
            status,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "green";
      case "Low Stock":
        return "orange";
      case "Out of Stock":
        return "red";
      case "Backordered":
        return "purple";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Icon as={FiCheckCircle} />;
      case "Low Stock":
      case "Out of Stock":
      case "Backordered":
        return <Icon as={FiAlertTriangle} />;
      default:
        return null;
    }
  };

  // Filter inventory based on search and active tab
  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;
      switch (activeTab) {
        case 0:
          matchesTab = true;
          break; // All
        case 1:
          matchesTab = item.status === "In Stock";
          break;
        case 2:
          matchesTab = item.status === "Low Stock";
          break;
        case 3:
          matchesTab = item.status === "Out of Stock";
          break;
        case 4:
          matchesTab = item.quantity <= item.minStockLevel;
          break;
      }

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Calculate inventory metrics
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => {
    // Mock unit prices based on category
    const unitPrices: Record<string, number> = {
      Components: 12.5,
      Assemblies: 25.0,
      Hardware: 2.5,
      Electromechanical: 45.0,
      Electronics: 18.0,
    };
    return sum + item.quantity * (unitPrices[item.category] || 10);
  }, 0);
  const lowStockItems = inventory.filter(
    (item) => item.status === "Low Stock"
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => item.status === "Out of Stock"
  ).length;
  const itemsNeedingReorder = inventory.filter(
    (item) => item.quantity <= item.minStockLevel
  ).length;

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />

      <Box pt={20} px={6} bg="gray.50" minH="calc(100vh - 128px)">
        {/* Header and Actions */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="xl" color="gray.800">
            Warehouse Inventory
          </Heading>

          <Button
            colorScheme="warehouse"
            leftIcon={<FiPlus />}
            onClick={onOpen}
          >
            Add Item
          </Button>
        </Flex>

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Items</StatLabel>
                <StatNumber>{totalItems}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  8% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Inventory Value</StatLabel>
                <StatNumber>${totalValue.toLocaleString()}</StatNumber>
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
                <StatLabel>Low Stock</StatLabel>
                <StatNumber
                  color={lowStockItems > 0 ? "orange.500" : "green.500"}
                >
                  {lowStockItems}
                </StatNumber>
                <StatHelpText>
                  {lowStockItems > 0 ? (
                    <HStack color="orange.500">
                      <Icon as={FiAlertTriangle} />
                      <Text>Attention needed</Text>
                    </HStack>
                  ) : (
                    <HStack color="green.500">
                      <Icon as={FiCheckCircle} />
                      <Text>All good</Text>
                    </HStack>
                  )}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Out of Stock</StatLabel>
                <StatNumber
                  color={outOfStockItems > 0 ? "red.500" : "green.500"}
                >
                  {outOfStockItems}
                </StatNumber>
                <StatHelpText>
                  {outOfStockItems > 0 ? (
                    <HStack color="red.500">
                      <Icon as={FiAlertCircle} />
                      <Text>Urgent action needed</Text>
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
        </SimpleGrid>

        {/* Main Content */}
        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Inventory Table */}
          <Box flex={3}>
            <Card>
              <CardHeader bg="warehouse.500" borderTopRadius="md">
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align="center"
                >
                  <HStack>
                    <Icon as={FiBox} color="white" />
                    <Heading size="md" color="white">
                      Inventory
                    </Heading>
                  </HStack>

                  <Flex gap={2} mt={{ base: 3, md: 0 }} wrap="wrap">
                    <Input
                      placeholder="Search inventory..."
                      size="sm"
                      maxW="300px"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      bg="white"
                      leftElement={<Icon as={FiSearch} color="gray.400" />}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<FiFilter />}
                      bg="white"
                    >
                      Advanced
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<FiDownload />}
                      bg="white"
                    >
                      Export
                    </Button>
                  </Flex>
                </Flex>
              </CardHeader>

              <CardBody p={0}>
                <Tabs
                  variant="enclosed"
                  onChange={(index) => setActiveTab(index)}
                >
                  <TabList>
                    <Tab>All Items</Tab>
                    <Tab>In Stock</Tab>
                    <Tab>Low Stock</Tab>
                    <Tab>Out of Stock</Tab>
                    <Tab>Below Min</Tab>
                  </TabList>

                  <TabPanels>
                    {[0, 1, 2, 3, 4].map((tabIndex) => (
                      <TabPanel key={tabIndex} p={0}>
                        <Table variant="striped" size="sm">
                          <Thead>
                            <Tr>
                              <Th>SKU</Th>
                              <Th>Item</Th>
                              <Th>Category</Th>
                              <Th>Location</Th>
                              <Th isNumeric>Quantity</Th>
                              <Th>Status</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredInventory.length > 0 ? (
                              filteredInventory.map((item) => (
                                <Tr key={item.id}>
                                  <Td fontWeight="medium">{item.sku}</Td>
                                  <Td>
                                    <HStack>
                                      {item.image && (
                                        <Avatar
                                          size="sm"
                                          src={item.image}
                                          name={item.name}
                                          bg="warehouse.100"
                                          color="warehouse.700"
                                        />
                                      )}
                                      <Text>{item.name}</Text>
                                    </HStack>
                                  </Td>
                                  <Td>{item.category}</Td>
                                  <Td>{item.location}</Td>
                                  <Td isNumeric>
                                    <Flex direction="column">
                                      {item.quantity}
                                      <Text fontSize="xs" color="gray.500">
                                        Min: {item.minStockLevel}
                                      </Text>
                                    </Flex>
                                  </Td>
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
                                  <Td>
                                    <Menu>
                                      <MenuButton
                                        as={IconButton}
                                        aria-label="Actions"
                                        icon={<FiMoreVertical />}
                                        variant="ghost"
                                        size="sm"
                                      />
                                      <MenuList>
                                        <MenuItem icon={<FiEdit2 />}>
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          icon={<FiArrowUp />}
                                          onClick={() =>
                                            updateItemQuantity(
                                              item.id,
                                              item.quantity + 1
                                            )
                                          }
                                        >
                                          Increase Quantity
                                        </MenuItem>
                                        <MenuItem
                                          icon={<FiArrowDown />}
                                          onClick={() =>
                                            updateItemQuantity(
                                              item.id,
                                              Math.max(0, item.quantity - 1)
                                            )
                                          }
                                        >
                                          Decrease Quantity
                                        </MenuItem>
                                        <MenuItem
                                          icon={<FiTrash2 />}
                                          color="red.500"
                                          onClick={() => deleteItem(item.id)}
                                        >
                                          Delete
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </Td>
                                </Tr>
                              ))
                            ) : (
                              <Tr>
                                <Td colSpan={7} textAlign="center" py={8}>
                                  <Text color="gray.500">
                                    No inventory items found
                                  </Text>
                                </Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </CardBody>

              <CardFooter>
                <Text fontSize="sm" color="gray.500">
                  Showing {filteredInventory.length} of {inventory.length} items
                </Text>
              </CardFooter>
            </Card>
          </Box>

          {/* Right Sidebar */}
          <Box flex={1}>
            <VStack spacing={6} align="stretch">
              {/* Incoming Shipments */}
              <Card>
                <CardHeader bg="blue.50">
                  <HStack>
                    <Icon as={FiArrowDown} color="blue.500" />
                    <Heading size="md">Incoming Shipments</Heading>
                  </HStack>
                </CardHeader>
                <CardBody p={0}>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Item</Th>
                        <Th>From</Th>
                        <Th isNumeric>Qty</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {incoming.map((shipment) => (
                        <Tr key={shipment.id}>
                          <Td>{shipment.itemName}</Td>
                          <Td>{shipment.from}</Td>
                          <Td isNumeric>{shipment.quantity}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                shipment.status === "In Transit"
                                  ? "blue"
                                  : shipment.status === "Delayed"
                                  ? "red"
                                  : "green"
                              }
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {shipment.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
                <CardFooter>
                  <Button variant="link" colorScheme="blue" size="sm">
                    View all incoming
                  </Button>
                </CardFooter>
              </Card>

              {/* Outgoing Shipments */}
              <Card>
                <CardHeader bg="orange.50">
                  <HStack>
                    <Icon as={FiArrowUp} color="orange.500" />
                    <Heading size="md">Outgoing Shipments</Heading>
                  </HStack>
                </CardHeader>
                <CardBody p={0}>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Item</Th>
                        <Th>To</Th>
                        <Th isNumeric>Qty</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {outgoing.map((shipment) => (
                        <Tr key={shipment.id}>
                          <Td>{shipment.itemName}</Td>
                          <Td>{shipment.to}</Td>
                          <Td isNumeric>{shipment.quantity}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                shipment.status === "Processing"
                                  ? "orange"
                                  : shipment.status === "Shipped"
                                  ? "blue"
                                  : "green"
                              }
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {shipment.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
                <CardFooter>
                  <Button variant="link" colorScheme="orange" size="sm">
                    View all outgoing
                  </Button>
                </CardFooter>
              </Card>

              {/* Stock Levels */}
              <Card>
                <CardHeader bg="warehouse.50">
                  <HStack>
                    <Icon as={FiTrendingUp} color="warehouse.600" />
                    <Heading size="md">Stock Levels</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {inventory
                      .filter((item) => item.quantity <= item.minStockLevel)
                      .sort((a, b) => a.quantity - b.quantity)
                      .slice(0, 3)
                      .map((item) => (
                        <Box key={item.id}>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{item.name}</Text>
                            <Text
                              color={
                                item.quantity === 0 ? "red.500" : "orange.500"
                              }
                            >
                              {item.quantity}/{item.minStockLevel}
                            </Text>
                          </Flex>
                          <Progress
                            value={(item.quantity / item.minStockLevel) * 100}
                            colorScheme={
                              item.quantity === 0
                                ? "red"
                                : item.quantity <= item.minStockLevel
                                ? "orange"
                                : "green"
                            }
                            size="sm"
                            borderRadius="md"
                            mt={1}
                          />
                        </Box>
                      ))}
                    {itemsNeedingReorder === 0 && (
                      <Text color="green.500" textAlign="center" py={2}>
                        <Icon as={FiCheckCircle} mr={2} />
                        All items above minimum stock levels
                      </Text>
                    )}
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button
                    variant="link"
                    colorScheme="warehouse"
                    size="sm"
                    isDisabled={itemsNeedingReorder === 0}
                  >
                    {itemsNeedingReorder > 0
                      ? `Create PO for ${itemsNeedingReorder} items`
                      : "No reorders needed"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Warehouse Map */}
              <Card>
                <CardHeader bg="gray.50">
                  <HStack>
                    <Icon as={FiHome} color="gray.600" />
                    <Heading size="md">Warehouse Map</Heading>
                  </HStack>
                </CardHeader>
                <CardBody p={0}>
                  <Image
                    src="https://via.placeholder.com/400x200?text=Warehouse+Layout"
                    alt="Warehouse Map"
                    objectFit="cover"
                    w="100%"
                    h="200px"
                  />
                </CardBody>
                <CardFooter>
                  <Button variant="link" colorScheme="gray" size="sm">
                    View Full Map
                  </Button>
                </CardFooter>
              </Card>
            </VStack>
          </Box>
        </Flex>
      </Box>

      <Footer />

      {/* Add Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Inventory Item</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Widget A"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>SKU</FormLabel>
                  <Input
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Will generate if empty"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Select category"
                  >
                    <option value="Components">Components</option>
                    <option value="Assemblies">Assemblies</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Electromechanical">Electromechanical</option>
                    <option value="Electronics">Electronics</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Bay 1, Shelf 2"
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

                <FormControl isRequired>
                  <FormLabel>Minimum Stock Level</FormLabel>
                  <Input
                    name="minStockLevel"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    placeholder="Reorder threshold"
                  />
                </FormControl>
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="warehouse" type="submit">
                Add Item
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
